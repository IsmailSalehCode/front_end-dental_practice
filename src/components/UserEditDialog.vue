<template>
  <v-dialog
    v-model="dialog"
    persistent
    :loading="loadingEdit"
    max-width="520px"
    transition="dialog-top-transition"
  >
    <v-card :loading="loadingEdit">
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn color="red" icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>ID: {{ user.id }}</v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        :disabled="loadingEdit"
        @submit.prevent
        @submit="editUser()"
      >
        <v-card-text>
          <!--has to be unique-->
          <v-text-field
            :label="$t('username')"
            v-model="user.username"
            :rules="[rules.required, rules.max(100)]"
            outlined
          ></v-text-field>
          <v-text-field
            :label="$t('password')"
            v-model="user.password"
            :rules="[rules.required, rules.password]"
            :hint="$t('password-format-description')"
            outlined
            validate-on-blur
          ></v-text-field>
          <v-text-field
            :label="$t('contactForm.emailLabel')"
            v-model="user.email"
            :rules="emailRules"
            outlined
            validate-on-blur
          ></v-text-field>
          <v-text-field
            :label="$t('contactForm.phoneLabel')"
            v-model="user.phone"
            :rules="[rules.max(22)]"
            outlined
          ></v-text-field>
          <v-text-field
            :label="$t('other contact info')"
            v-model="user.otherContact"
            :rules="[rules.max(500)]"
            outlined
          ></v-text-field>
          <v-select
            v-model="user.role"
            :items="availableRoles"
            item-text="text"
            item-value="value"
            :rules="[rules.required]"
            :label="$t('role')"
            outlined
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn class="success" type="submit" :loading="loadingEdit">
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
import UserService from "../services/UserService";

export default {
  mixins: [responseEval],
  emits: ["refreshUsers", "done"],
  computed: {
    availableRoles() {
      return this.$store.getters.availableRoles;
    },
  },
  data() {
    return {
      valid: true,
      rules: this.$store.getters.rules,
      emailRules: this.$store.getters.emailRules,
      loadingEdit: false,
      dialog: false,
      user: {
        id: null,
        username: null,
        password: null,
        email: null,
        phone: null,
        otherContact: null,
        role: null,
      },
    };
  },
  methods: {
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
          break;
        case 409:
          alert(this.$t("Entered username has already been taken."));
          break;
        case 404:
          alert(this.$t("User has been deleted"));
          this.$emit("refreshUsers");
          this.close();
          break;
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
      }
    },
    async editUser() {
      if (this.$refs.form.validate()) {
        this.loadingEdit = true;
        let response = null;
        try {
          response = await UserService.editUser(this.user.id, this.user);
        } catch (err) {
          // console.error(err);
          this.handleError(err);
        }
        if (this.isSuccessful(response)) {
          this.$emit("refreshUsers");
          this.close();
          this.$emit("done");
        }
        // for dev
        // console.log(response);
        // =========
        this.loadingEdit = false;
      }
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    open(user) {
      // console.log(user);
      this.user = structuredClone(user);
      this.dialog = true;
    },
  },
};
</script>

<style>
</style>