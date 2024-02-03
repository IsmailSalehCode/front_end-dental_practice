<template>
  <v-container>
    <v-card>
      <v-card-title style="word-break: break-word">{{
        $t(
          "Appointment System is deactivated. Please make use of the information provided below."
        )
      }}</v-card-title>
      <!-- <v-card-text> -->
      <ContactInfo />
      <!-- </v-card-text> -->
    </v-card>
  </v-container>
</template>

<script>
import ContactInfo from "../components/ContactInfo.vue";

export default {
  components: {
    ContactInfo,
  },
};
</script>

<style>
</style>