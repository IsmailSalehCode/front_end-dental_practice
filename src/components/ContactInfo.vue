<template>
  <v-container style="max-width: 1135px">
    <v-row style="justify-content: center">
      <v-col cols="12" sm="8" style="max-width: 700px">
        <div class="map-responsive">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1036.8912730646427!2d23.30248862850893!3d42.68738827155967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa853d6ad6d797%3A0x3b5e73ee9aa3e13b!2sul.%20%22Ami%20Boue%22%2027%2C%201606%20Kriva%20Reka%2C%20Sofia!5e0!3m2!1sen!2sbg!4v1653751957662!5m2!1sen!2sbg"
            style="outline: black; outline-width: 4px; outline-style: auto"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </v-col>
      <v-col cols="12" sm="4" style="min-width: 320px">
        <v-card tile style="max-width: 400px" :loading="loadingData">
          <v-card-text>
            <p>
              <b>{{ $t("Address") }}: </b>
              {{ $t("ul. Ami Boue 27, 1606 Kriva Reka, Sofia") }}
            </p>
            <p>
              <b>{{ $t("contactForm.phoneLabel") }}: </b>
              {{ business.phone }}
            </p>
            <p>
              <b>{{ $t("Working hours") }}: </b>
              {{ business.workingHours }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BusinessDetailsService from "../services/BusinessDetailsService";
import responseEval from "../Mixins/responseEval";
export default {
  mixins: [responseEval],
  mounted() {
    this.getBusinessDetails();
  },
  methods: {
    async getBusinessDetails() {
      let response = null;
      this.business = {};
      this.loadingData = true;
      try {
        response = await BusinessDetailsService.get();
      } catch (err) {
        // console.log(err);
        this.setEmpty();
      }
      // console.log(response);
      if (this.isSuccessful(response)) {
        this.business = response.data;
      }
      this.loadingData = false;
    },
    setEmpty() {
      this.business = {
        phone: "-",
        workingHours: "-",
      };
    },
  },
  data() {
    return {
      business: {},
      loadingData: true,
    };
  },
};
</script>

<style scoped>
.map-responsive {
  overflow: hidden;

  padding-bottom: 56.25%;

  position: relative;

  height: 0;
}

.map-responsive iframe {
  left: 0;

  top: 0;

  height: 100%;

  width: 100%;

  position: absolute;
}
</style>