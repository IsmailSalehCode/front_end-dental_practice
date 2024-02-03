<template>
  <div>
    <!-- Loading -->
    <v-container
      style="text-align: center"
      v-if="loadingAvailableDateTimes == true"
    >
      <br />
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>
    <!-- End Loading -->

    <!-- Start available date times loaded successfully -->
    <v-container
      fluid
      v-if="
        loadingAvailableDateTimes == false &&
        errorLoadingAvailableDateTimes == false
      "
    >
      <div v-if="availableDateTimes.length == 0">
        <h3 style="color: red; text-align: center">
          {{ $t("Currently there are no slots for an appointment.") }}
        </h3>
        <br />
      </div>
      <hr />
      <!-- Refresh btn -->
      <v-col cols="12" style="text-align: center">
        <v-btn depressed class="info" @click="init()"
          >{{ $t("refresh hours") }} <v-icon right dark>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
      <!-- End Refresh btn -->
      <hr />
      <v-container fluid>
        <v-card outlined v-if="availableDateTimes.length > 0">
          <v-card-text>
            <v-row>
              <v-col
                v-for="item in availableDateTimes"
                :key="item.start"
                style="text-align: center"
              >
                <v-btn rounded color="success" @click="doStupidParam(item)">
                  {{ $d(new Date(item.start), "long") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <br />
        <v-col cols="12">
          <v-row>
            <v-col style="max-width: 80px; text-align: center" class="px-0">
              <v-btn outlined icon color="grey darken-2" @click="prev()">
                <v-icon> mdi-chevron-left </v-icon>
              </v-btn>
            </v-col>
            <v-col style="max-width: 120px; text-align: center" class="px-0">
              <h4 v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </h4>
            </v-col>
            <v-col style="max-width: 80px; text-align: center" class="px-0">
              <v-btn outlined icon color="grey darken-2" @click="next()">
                <v-icon> mdi-chevron-right </v-icon>
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col style="text-align: end">
              <v-btn outlined color="grey darken-2" @click="setToday()">{{
                $t("focus today")
              }}</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="mt-2">
          <v-row style="justify-content: center; align-items: center">
            <span class="mr-2"> {{ $t("calendarViewTypeLabel") }}: </span>
            <v-menu bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ $t(type) }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>{{ $t("day") }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>{{ $t("week") }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>{{ $t("month") }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>{{ $t("4day") }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-col>
      </v-container>
      <v-sheet height="600">
        <v-calendar
          :locale="this.$store.state.locale"
          :type="type"
          ref="calendar"
          v-model="calendarFocus"
          color="primary"
          :events="availableDateTimes"
          event-color="green"
          @click:date="viewDay"
          @click:event="openAppointmentForm"
        ></v-calendar>
      </v-sheet>
      <br />
      <br />
    </v-container>
    <!-- End available date times loaded successfully -->

    <!-- Error Message -->
    <v-container fluid v-if="errorLoadingAvailableDateTimes == true">
      <v-alert border="right" type="error">{{ $t(errorMessage) }}</v-alert>
    </v-container>
    <!-- End Error Message -->

    <AppointmentForm ref="AForm" />
  </div>
</template>

<script>
import responseEval from "@/Mixins/responseEval";
import AppointmentService from "@/services/AppointmentService";
import AppointmentForm from "@/components/AppointmentForm.vue";
export default {
  components: { AppointmentForm },
  mixins: [responseEval],
  data() {
    return {
      type: "4day",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      calendarFocus: "",
      loadingAvailableDateTimes: true,
      errorLoadingAvailableDateTimes: false,
      errorMessage: null,
      availableDateTimes: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    doStupidParam(item) {
      this.openAppointmentForm({ event: item });
    },
    openAppointmentForm({ event }) {
      this.$refs.AForm.open(event);
    },
    init() {
      this.getAvailableDateTimes();
      //this piece of code is needed for the month+year to show on startup
      setTimeout(() => {
        this.next();
        this.setToday();
      }, "100");
      //==================
    },
    indicateErrorLoadingDateTimes(err) {
      this.errorLoadingAvailableDateTimes = true;
      if (this.isOffline(err)) {
        this.errorMessage = "Check your Internet connection and try again.";
        return;
      }
      if (err.response.status == 500) {
        this.errorMessage =
          "An unknown error occured on our side. Please contact support.";
      }
    },
    async getAvailableDateTimes() {
      this.loadingAvailableDateTimes = true;
      this.errorLoadingAvailableDateTimes = false;
      this.availableDateTimes = [];
      let response = null;
      try {
        response = await AppointmentService.getAvailableDateTimes();
      } catch (err) {
        this.indicateErrorLoadingDateTimes(err);
      }
      this.loadingAvailableDateTimes = false;
      if (this.isSuccessful(response)) {
        //backend returns datetimes in EU/Sofia timezone
        const data = response.data;
        for (let i = 0; i < data.length; i++) {
          const dateId = data[i].id;
          const date = data[i].datetime;
          this.availableDateTimes.push({
            id: dateId,
            start: date,
          });
        }
        // console.log(this.availableDateTimes);
      }
    },
    setToday() {
      this.calendarFocus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    viewDay({ date }) {
      this.calendarFocus = date;
      this.type = "day";
    },
  },
};
</script>

<style>
</style>