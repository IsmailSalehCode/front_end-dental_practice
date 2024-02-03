<template>
  <v-dialog v-model="dialog" persistent :loading="loadingB" max-width="360px">
    <v-card :loading="loadingB">
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- <v-card-title>Business Details</v-card-title> -->
      <v-form
        ref="form"
        v-model="valid"
        :disabled="loadingB"
        @submit.prevent
        @submit="edit()"
      >
        <v-card-text>
          <v-text-field
            :label="$t('contactForm.phoneLabel')"
            v-model="business.phone"
            :rules="[rules.required, rules.max(300)]"
            counter="300"
            outlined
          ></v-text-field>
          <v-text-field
            :label="$t('Working hours')"
            v-model="business.workingHours"
            :rules="[rules.required, rules.max(300)]"
            counter="300"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn class="success" type="submit" :loading="loadingB">
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
import BusinessDetailService from "../services/BusinessDetailsService";
export default {
  mixins: [responseEval],
  emits: ["done"], //popup
  data() {
    return {
      valid: true,
      rules: this.$store.getters.rules,
      loadingB: false,
      dialog: false,
      business: {
        phone: null,
        workingHours: null,
      },
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    open() {
      this.dialog = true;
    },
    // direktno editvame, nqma get-vame
    async edit() {
      if (this.$refs.form.validate()) {
        this.loadingB = true;
        let response = null;
        try {
          response = await BusinessDetailService.edit({
            workingHours: this.business.workingHours,
            phone: this.business.phone,
          });
        } catch (err) {
          this.evalError(err);
        }
        if (this.isSuccessful(response)) {
          this.close();
          this.$emit("done");
        }
        this.loadingB = false;
      }
    },
  },
};
</script>

<style>
</style>