<template>
  <v-container style="max-width: 370px">
    <v-card :disabled="loadingREST" :loading="loadingREST" rounded="lg">
      <v-card-text>
        {{ $t("Time zone") }}: EU/Sofia {{ $t("only") }}
        <v-menu
          v-model="dateMenu"
          :nudge-right="40"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              style="max-width: 200px"
              v-model="selectedDateFormatted"
              :label="$t('Choose a date')"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :locale="selectedLocale"
            v-model="selectedDate"
            @input="dateMenu = false"
          ></v-date-picker>
        </v-menu>
        <v-menu
          ref="timeMenu"
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="selectedTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              style="max-width: 170px"
              v-model="selectedTime"
              :label="$t('Select time')"
              prepend-icon="mdi-clock"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            format="24hr"
            v-if="timeMenu"
            v-model="selectedTime"
            full-width
            @click:minute="$refs.timeMenu.save(selectedTime)"
          ></v-time-picker>
        </v-menu>
        <v-btn
          outlined
          :disabled="!canSubmit"
          :loading="loadingREST"
          @click="addToDB()"
          >{{ $t("Add new appointment datetime") }}</v-btn
        >
      </v-card-text>
    </v-card>
    <PopUp ref="popUp" />
  </v-container>
</template>

<script>
import i18n from "../plugins/i18n";
import AppointmentService from "../services/AppointmentService";
import responseEval from "../Mixins/responseEval";
import PopUp from "../components/PopUp.vue";
export default {
  components: {
    PopUp,
  },
  mixins: [responseEval],
  computed: {
    canSubmit() {
      return this.selectedDate != null && this.selectedTime != null;
    },
    selectedDateFormatted() {
      if (this.selectedDate != null) {
        return i18n.d(new Date(this.selectedDate), "short");
      }
      return null;
    },
    selectedLocale() {
      if (this.$store.state.locale == "en") {
        return "en-US";
      } else if (this.$store.state.locale == "bg") {
        return "bg-bg";
      }
      return "en-US";
    },
  },
  data() {
    return {
      rules: this.$store.getters.rules,
      dateMenu: false,
      selectedDate: null,
      timeMenu: false,
      selectedTime: null,
      loadingREST: false,
    };
  },
  methods: {
    async addToDB() {
      if (this.canSubmit) {
        const newDatetime = this.selectedDate + " " + this.selectedTime;
        this.loadingREST = true;
        let response = null;
        try {
          response = await AppointmentService.addDateTime({
            datetime: new Date(newDatetime),
            //passing the UTC value of the date to the backend
          });
        } catch (err) {
          this.handleError(err);
          return;
        }
        if (this.isSuccessful(response)) {
          //1) notify it was successful
          this.$refs.popUp.open("done");
          //2) reset time on purpose so that adding datetimes for one day is easier
          this.selectedTime = null;
        }
        this.loadingREST = false;
      }
    },
    handleError(err) {
      this.loadingREST = false;
      //isOnline method from mixin responseEval
      if (err.toString() === "Error: Network Error") {
        alert(i18n.t("Check your Internet connection and try again."));
        return;
      }
      const errStatusCode = err.response.status;
      switch (errStatusCode) {
        case 400:
          alert(this.$t("You sent invalid or bad data."));
          break;
        case 401:
          alert(this.$t("Unauthorized."));
          break;
        case 403:
          alert(this.$t("Your account has been disabled"));
          this.$router.push("/logout").catch(() => {});
          break;
        case 409:
          alert(i18n.t("value is not unique"));
          break;
        case 500:
          alert(
            i18n.t(
              "An unknown error occured on our side. Please contact support."
            )
          );
          break;
        default:
          alert(errStatusCode);
          break;
      }
    },
  },
};
</script>

<style>
</style>