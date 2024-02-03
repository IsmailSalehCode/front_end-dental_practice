<template>
  <v-card
    :loading="loadingAF"
    :disabled="loadingAF"
    style="max-width: 520px"
    elevation="8"
  >
    <v-card-title>
      {{ $t("chosen datetime") }}:
      <br />
      {{ $d(new Date(appointmentForm.datetime), "long") }}
    </v-card-title>
    <hr />
    <v-card-text>
      <v-checkbox
        readonly
        v-model="appointmentForm.isNewPatient"
        :label="$t(newOrReturningPatient(appointmentForm.isNewPatient))"
      ></v-checkbox>
      <v-select
        :items="availableProcedures"
        v-model="appointmentForm.helpWith"
        dense
        readonly
        item-text="text"
        item-value="value"
        :label="$t('what can we help you with')"
        outlined
      ></v-select>
      <v-text-field
        v-model="appointmentForm.name"
        dense
        readonly
        :label="$t('contactForm.nameLabel')"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="appointmentForm.email"
        dense
        readonly
        :label="$t('contactForm.emailLabel')"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="appointmentForm.phone"
        dense
        readonly
        :label="$t('contactForm.phoneLabel')"
        outlined
      ></v-text-field>
      <v-textarea
        v-if="isNotEmpty(appointmentForm.message)"
        :label="$t('my-message')"
        v-model="appointmentForm.message"
        dense
        readonly
        outlined
      ></v-textarea>
    </v-card-text>
    <hr />
    <v-card-actions>
      <!-- <v-btn
        icon
        outlined
        color="red"
        @click="deleteMyAppointment(item.datetime)"
      > -->
      <v-btn icon outlined color="red" @click="$emit('delete')">
        <v-icon> mdi-delete </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  emits: ["delete"],
  props: {
    form: Object,
  },
  data() {
    return {
      // appointmentForm: this.form, let this be a lesson -> if appointmentForm is in data, it won't update upon prop change; that is why it is in computed
      loadingAF: false,
    };
  },
  mounted() {
    this.loadingAF = false;
  },
  methods: {
    startAF_loading() {
      this.loadingAF = true;
    },
    stopAF_loading() {
      this.loadingAF = false;
    },
    isNotEmpty(msg) {
      return msg != null && msg != "";
    },
    newOrReturningPatient(isNewPatient) {
      if (isNewPatient) {
        return "i am a new patient";
      }
      return "i am a returning patient";
    },
  },
  computed: {
    appointmentForm() {
      return this.form;
    },
    availableProcedures() {
      return this.$store.getters.availableProcedures;
    },
  },
};
</script>

<style>
</style>