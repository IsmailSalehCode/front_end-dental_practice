<template >
  <v-dialog
    persistent
    v-model="dialog"
    max-width="550px"
    transition="dialog-bottom-transition"
  >
    <v-card :loading="loadingSendBtn">
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>
        {{ $t("chosen datetime") }}:
        <br />
        {{ $d(new Date(dateTime.start), "long") }}
      </v-card-title>
      <hr />
      <v-form
        ref="form"
        v-model="valid"
        :disabled="loadingSendBtn"
        @submit.prevent
        @submit="submit"
      >
        <v-card-text>
          <v-checkbox
            v-model="aForm.isNewPatient"
            :label="$t(newOrReturningPatient)"
          ></v-checkbox>
          <v-select
            v-model="aForm.helpWith"
            :items="availableProcedures"
            item-text="text"
            item-value="value"
            :rules="[rules.required]"
            dense
            :label="$t('what can we help you with')"
            outlined
          ></v-select>
          <v-text-field
            v-model.trim="aForm.name"
            dense
            :label="$t('contactForm.nameLabel')"
            :rules="[
              rules.required,
              rules.max(300),
              rules.onlyLetters,
              rules.min(3),
            ]"
            validate-on-blur
            outlined
          ></v-text-field>
          <v-text-field
            v-model.trim="aForm.email"
            type="email"
            style="max-width: 300px"
            validate-on-blur
            :rules="emailRules"
            dense
            :label="$t('contactForm.emailLabel')"
            outlined
          ></v-text-field>
          <v-text-field
            v-model.trim="aForm.phone"
            style="max-width: 300px"
            dense
            :label="$t('contactForm.phoneLabel')"
            :rules="[rules.required, rules.max(22)]"
            outlined
          ></v-text-field>
          <v-textarea
            v-model.trim="aForm.message"
            validate-on-blur
            :rules="[rules.max(500)]"
            outlined
            :placeholder="$t('is there anything else we should know')"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn class="success" type="submit" :loading="loadingSendBtn">
            {{ $t("make the appointment") }}
          </v-btn>
          <v-btn class="error" @click="close()">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import AppointmentService from "@/services/AppointmentService";
import responseEval from "@/Mixins/responseEval";

export default {
  mixins: [responseEval],

  computed: {
    newOrReturningPatient() {
      if (this.aForm.isNewPatient) {
        return "i am a new patient";
      }
      return "i am a returning patient";
    },
    availableProcedures() {
      return this.$store.getters.availableProcedures;
    },
  },
  data() {
    return {
      rules: this.$store.getters.rules,
      dialog: false,
      dateTime: {
        id: null,
        start: null,
      },
      aForm: {
        isNewPatient: true,
        helpWith: null,
        name: null,
        phone: null,
        email: null,
        message: null,
        appointmentDateTimeId: null,
      },
      valid: true,
      emailRules: this.$store.getters.emailRules,
      loadingSendBtn: false,
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loadingSendBtn = true;
        this.aForm.appointmentDateTimeId = this.dateTime.id;
        // console.log(this.aForm);
        /**
         * {
    "isNewPatient": true,
    "helpWith": "emergency/tooth pain",
    "name": "Isi",
    "phone": null,
    "email": "isi_4@abv.bg",
    "message": null,
    "appointmentDateTimeId": 2
}
         */
        let response = null;
        try {
          response = await AppointmentService.addForm({
            isNewPatient: this.aForm.isNewPatient,
            helpWith: this.aForm.helpWith,
            name: this.aForm.name,
            phone: this.aForm.phone,
            email: this.aForm.email,
            message: this.aForm.message,
            appointmentDateTimeId: this.aForm.appointmentDateTimeId,
          });
        } catch (err) {
          this.handleError(err);
        }
        if (this.isSuccessful(response)) {
          // inform it was successful
          alert(this.$t("You have successfully made an appointment!"));
          //add to myAppointments in state
          this.addNewAppointmentToState();
          //route to my-appointments
          this.$router.push("/my-appointments").catch(() => {});
        }
        this.loadingSendBtn = false;
      }
    },
    addNewAppointmentToState() {
      this.$store.dispatch("addToMyAppointments", {
        isNewPatient: this.aForm.isNewPatient,
        helpWith: this.aForm.helpWith,
        name: this.aForm.name,
        phone: this.aForm.phone,
        email: this.aForm.email,
        message: this.aForm.message,
        datetime: this.dateTime.start,
      });
    },
    handleError(err) {
      if (this.isOffline(err)) {
        alert(this.$t("Check your Internet connection and try again."));
        return;
      }
      switch (err.response.status) {
        case 500:
          alert(
            this.$t(
              "An unknown error occured on our side. Please contact support."
            )
          );
          //refresh page
          location.reload();
          break;
        case 404:
          alert(
            this.$t(
              "Your datetime is unavailable. The calendar will now be refreshed."
            )
          );
          //refresh page
          location.reload();
          break;
      }
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    open(dateTime) {
      this.dateTime = dateTime;
      this.dialog = true;
    },
  },
};
</script>