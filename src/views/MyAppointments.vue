<template>
  <v-container fluid>
    <br />
    <v-row>
      <v-col cols="12" style="text-align: start">
        <h2>
          {{ $t("my-appointments") }}
          <hr />
        </h2>
      </v-col>
    </v-row>
    <br />
    <v-container fluid v-if="myAppointments.length > 0">
      <v-row>
        <v-col v-for="item in myAppointments" :key="item.datetime">
          <ReadAppointmentForm
            :form="item"
            @delete="deleteMyAppointment(item.datetime)"
          />
        </v-col>
      </v-row>
      <br />
      <br />
      <hr />
      <v-row>
        <v-col cols="12">
          <ContactInfo />
        </v-col>
      </v-row>
    </v-container>
    <!-- No appointments made message -->
    <v-row v-if="myAppointments.length == 0">
      <v-col>
        <v-sheet>
          <h3>
            {{ $t("No saved appointments") }}
          </h3>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- End of no appointments made message -->
    <v-row v-if="myAppointments.length == 0">
      <v-col cols="12">
        <v-btn color="#E7CA71" to="/make-an-appointment" rounded>{{
          $t("make an appointment")
        }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import i18n from "@/plugins/i18n";
import ReadAppointmentForm from "../components/ReadAppointmentForm.vue";
import ContactInfo from "../components/ContactInfo.vue";

export default {
  components: {
    ReadAppointmentForm,
    ContactInfo,
  },
  methods: {
    deleteMyAppointment(datetime) {
      const today = new Date();
      const appointmentIsInTheFuture = new Date(datetime) > today;
      // console.log(appointmentIsInTheFuture);
      if (appointmentIsInTheFuture) {
        alert(i18n.t("call cancellation"));
      }
      //remove from store
      this.$store.dispatch("removeFromMyAppointments", datetime);
      //=================
      // console.log("DONE");
    },
  },
  computed: {
    myAppointments() {
      return this.$store.state.myAppointments;
    },
  },
};
</script>