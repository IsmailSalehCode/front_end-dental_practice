<template>
  <v-container fluid>
    <v-card :disabled="loadingRefresh" :loading="loadingRefresh" rounded="lg">
      <v-card-text>
        <v-row>
          <v-col cols="12" style="text-align: center">
            <v-btn depressed class="info" @click="getADTs()"
              >{{ $t("refresh hours") }} <v-icon right dark>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="pt-0">
            <hr />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            xl="3"
            style="text-align: center"
            v-for="adt in ADTs"
            :key="adt.id"
          >
            <v-card
              dark
              rounded="xl"
              :color="adt.appointmentFormId == null ? 'success' : 'error'"
              class="mx-auto"
              style="max-width: 315px; min-width: 240px"
            >
              <v-card-text style="color: white">
                {{ $d(new Date(adt.datetime), "long") }}
              </v-card-text>
              <v-card-actions>
                <v-btn outlined icon @click="deleteADT(adt.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loadingAF"
                  @click="
                    openAppointmentForm(adt.appointmentFormId, adt.datetime)
                  "
                  icon
                  v-if="adt.appointmentFormId != null"
                >
                  <v-icon>mdi-message-badge</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col v-if="ADTs.length == 0" cols="12">
            <h3 style="color: red; text-align: center">
              {{ $t("No appointment slots created.") }}
            </h3>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog max-width="520px" v-model="appointmentDetailsDialog">
      <v-card :rounded="false">
        <v-btn
          color="error"
          block
          tile
          @click="appointmentDetailsDialog = false"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card>
      <ReadAppointment
        ref="AF"
        :form="appointmentDetails"
        @delete="deleteAppointmentForm(appointmentDetails.id)"
      />
    </v-dialog>
    <PopUp ref="popUp" />
  </v-container>
</template>

<script>
import AppointmentService from "../services/AppointmentService";
import responseEval from "../Mixins/responseEval";
import ReadAppointment from "../components/ReadAppointmentForm.vue";
import PopUp from "../components/PopUp.vue";
export default {
  mixins: [responseEval],
  components: {
    ReadAppointment,
    PopUp,
  },
  data() {
    return {
      appointmentDetailsDialog: false,
      appointmentDetails: null,
      loadingRefresh: false,
      ADTs: [],
      loadingAF: false,
    };
  },
  mounted() {
    this.getADTs();
  },
  methods: {
    async deleteAppointmentForm(id) {
      this.$refs.AF.startAF_loading();
      console.log(id);
      let response = null;
      try {
        response = await AppointmentService.deleteForm(id);
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.$refs.popUp.open("done");
        this.appointmentDetailsDialog = false;
        this.getADTs();
      }
      this.$refs.AF.stopAF_loading();
    },
    async getADTs() {
      this.ADTs = [];
      this.loadingRefresh = true;
      let response = null;
      try {
        response = await AppointmentService.getAllDateTimes();
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.ADTs = response.data;
      }
      this.loadingRefresh = false;
    },
    async openAppointmentForm(adtId, adtDateTime) {
      // console.log(adtId);
      this.loadingAF = true;
      let response = null;
      try {
        response = await AppointmentService.getSpecificForm(adtId);
      } catch (err) {
        this.handleOpenAppointmentFormError(err);
      }
      if (this.isSuccessful(response)) {
        const form = response.data;
        form.datetime = adtDateTime;
        this.openAppointmentDetailsDialog(form);
      }
      // console.log(response);
      this.loadingAF = false;
    },
    openAppointmentDetailsDialog(form) {
      // console.log(form);
      this.appointmentDetails = form;
      this.appointmentDetailsDialog = true;
    },
    handleOpenAppointmentFormError(err) {
      this.evalError(err); //check for auth errors as well
      const response = err.response;
      if (response != null) {
        if (response.status == 404) {
          alert("The requested Appointment form has been deleted.");
        }
      }
    },
    async deleteADT(id) {
      this.loadingRefresh = true;
      let response = null;
      try {
        response = await AppointmentService.deleteDateTime(id);
      } catch (err) {
        this.handleDeleteError(err);
      }
      if (this.isSuccessful(response)) {
        this.$refs.popUp.open("done");
        this.getADTs();
      }
      this.loadingRefresh = false;
    },
    handleDeleteError(err) {
      this.evalError(err); //check for auth errors as well
      const response = err.response;
      if (response != null) {
        if (response.status == 404) {
          this.getADTs();
        }
      }
    },
  },
};
</script>
