<template>
  <!-- todo max width -->
  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card :loading="loadingS">
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="refresh()" :loading="loadingS">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>{{ $t("Settings") }}</v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        :disabled="loadingS"
        @submit.prevent
        @submit="edit()"
      >
        <v-card-text>
          <v-checkbox
            v-model="sdc.wants_appointmentScheduling"
            :label="$t('sdc.wants_appointmentScheduling')"
          ></v-checkbox>
          <v-checkbox
            v-model="sdc.wants_webMessage"
            :label="$t('sdc.wants_webMessage')"
          ></v-checkbox>
          <div v-if="sdc.wants_webMessage">
            <v-text-field
              :label="$t('sdc.text_webMessage')"
              v-model="sdc.text_webMessage"
              :rules="[rules.required, rules.max(300)]"
              counter="300"
              outlined
            ></v-text-field>
            <v-select
              style="max-width: 210px"
              v-model="sdc.type_webMessage"
              :items="availableTypes_alert"
              item-text="text"
              item-value="value"
              :rules="[rules.required]"
              :label="$t('sdc.type_webMessage')"
              outlined
            ></v-select>
            <v-checkbox
              v-model="sdc.isProminent_webMessage"
              :label="$t('sdc.isProminent_webMessage')"
            ></v-checkbox>
            <v-checkbox
              v-model="sdc.isDense_webMessage"
              :label="$t('sdc.isDense_webMessage')"
            ></v-checkbox>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="success" type="submit" :loading="loadingS">
            {{ $t("edit") }}
          </v-btn>
          <v-btn class="error" @click="close()">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import responseEval from "../Mixins/responseEval";
import SiteDesignConfigService from "../services/SiteDesignConfigService";

export default {
  mixins: [responseEval],
  emits: ["done"], //popup
  computed: {
    availableTypes_alert() {
      return this.$store.getters.availableTypes_alert;
    },
  },
  data() {
    return {
      valid: true,
      rules: this.$store.getters.rules,
      loadingS: false,
      dialog: false,
      sdc: {
        wants_appointmentScheduling: false,
        wants_webMessage: false,
        text_webMessage: null,
        type_webMessage: null,
        isProminent_webMessage: false,
        isDense_webMessage: false,
      },
    };
  },
  methods: {
    refresh() {
      this.sdc = {
        wants_appointmentScheduling: false,
        wants_webMessage: false,
        text_webMessage: null,
        type_webMessage: null,
        isProminent_webMessage: false,
        isDense_webMessage: false,
      };
      this.getData();
    },
    close() {
      this.dialog = false;
    },
    open() {
      this.dialog = true;
      this.refresh();
    },
    async getData() {
      this.loadingS = true;
      let response = null;
      try {
        response = await SiteDesignConfigService.get();
      } catch (err) {
        console.log("error in getData v");
        // TODO eval error
        console.log(err);
      }
      if (this.isSuccessful(response)) {
        this.sdc = response.data;
      }
      this.loadingS = false;
    },
    async edit() {
      if (this.$refs.form.validate()) {
        this.loadingS = true;
        let response = null;
        try {
          response = await SiteDesignConfigService.edit({
            wants_appointmentScheduling: this.sdc.wants_appointmentScheduling,
            wants_webMessage: this.sdc.wants_webMessage,
            text_webMessage: this.sdc.text_webMessage,
            type_webMessage: this.sdc.type_webMessage,
            isProminent_webMessage: this.sdc.isProminent_webMessage,
            isDense_webMessage: this.sdc.isDense_webMessage,
          });
        } catch (err) {
          // TODO eval error
          console.log("err in catch v");
          console.log(err);
        }
        if (this.isSuccessful(response)) {
          this.close();
          location.reload();
          this.$emit("done");
        }
        this.loadingS = false;
      }
    },
  },
};
</script>

<style>
</style>