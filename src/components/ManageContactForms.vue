<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn icon :loading="loadingGetCFs" @click="refresh()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title class="justify-center pt-5">
        {{ $t("Delivered Contact Forms") }}
      </v-card-title>
      <hr />
      <v-card-actions class="pt-12">
        <v-btn
          tile
          depressed
          @click="validateAndDelete()"
          color="error"
          :loading="loadingDelete"
        >
          {{ $t("delete") }}
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-text-field
          style="max-width: 350px"
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search')"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          disable-sort
          :search="search"
          :loading="loadingGetCFs"
          :loading-text="$t('Loading... Please wait')"
          :no-results-text="$t('No matching records found')"
          :no-data-text="$t('No data available')"
          v-model="selected"
          :headers="headers"
          :items="CFs"
          :items-per-page="10"
          :single-select="true"
          item-key="id"
          show-select
          class="elevation-1"
        ></v-data-table>
      </v-card-text>
    </v-card>
    <PopUp ref="popUp" />
  </v-dialog>
</template>

<script>
import ContactFormService from "../services/ContactFormService";
import PopUp from "../components/PopUp.vue";
import responseEval from "../Mixins/responseEval";
export default {
  mixins: [responseEval],
  components: {
    PopUp,
  },
  methods: {
    validateAndDelete() {
      const arr = this.selected;
      if (arr.length == 1) {
        this.deleteCF(arr[0].id);
      } else {
        alert(this.$t("No row selected"));
      }
    },
    async deleteCF(id) {
      let response = null;
      this.loadingDelete = true;
      try {
        response = await ContactFormService.deleteForm(id);
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.$refs.popUp.open("done");
      }
      this.loadingDelete = false;
      this.refresh();
    },
    refresh() {
      this.selected = [];
      this.getCFs();
    },
    async getCFs() {
      this.CFs = [];
      this.loadingGetCFs = true;
      let response = null;
      try {
        response = await ContactFormService.getForms();
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.CFs = response.data;
      }
      this.loadingGetCFs = false;
    },
    open() {
      this.dialog = true;
      this.refresh();
    },
    close() {
      this.dialog = false;
    },
  },
  data() {
    return {
      dialog: false,
      loadingGetCFs: true,
      loadingDelete: false,
      CFs: [],
      selected: [],
      search: "",
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "ID",
          align: "start",
          value: "id",
        },
        {
          text: this.$t("contactForm.nameLabel"),
          value: "name",
        },
        {
          text: this.$t("contactForm.emailLabel"),
          value: "email",
        },
        {
          text: this.$t("contactForm.phoneLabel"),
          value: "phone",
        },
        {
          text: this.$t("The message"),
          value: "message",
        },
        {
          text: this.$t("Date of submission"),
          value: "createdAt",
        },
      ];
    },
  },
};
</script>

<style>
</style>