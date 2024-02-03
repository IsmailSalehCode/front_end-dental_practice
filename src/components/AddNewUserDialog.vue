<template>
  <v-dialog max-width="520px" persistent v-model="dialog">
    <v-card :loading="loadingAdd">
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form
        ref="form"
        v-model="valid"
        :disabled="loadingAdd"
        @submit.prevent
        @submit="addNewUser()"
      >
        <v-card-text>
          <!-- Repeating code from UserEditDialog.vue -->
          <v-text-field
            dense
            :label="$t('username')"
            v-model.trim="user.username"
            :rules="[rules.required, rules.max(100)]"
            outlined
          ></v-text-field>
          <v-text-field
            dense
            :label="$t('password')"
            v-model.trim="user.password"
            :rules="[rules.required, rules.password]"
            :hint="$t('password-format-description')"
            outlined
            validate-on-blur
          ></v-text-field>
          <v-text-field
            dense
            :label="$t('contactForm.emailLabel')"
            v-model.trim="user.email"
            :rules="emailRules"
            outlined
            validate-on-blur
          ></v-text-field>
          <v-text-field
            dense
            :label="$t('contactForm.phoneLabel')"
            v-model.trim="user.phone"
            :rules="[rules.max(22)]"
            outlined
          ></v-text-field>
          <v-text-field
            dense
            :label="$t('other contact info')"
            v-model.trim="user.otherContact"
            :rules="[rules.max(500)]"
            outlined
          ></v-text-field>
          <v-select
            dense
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
          <v-btn class="success" type="submit" :loading="loadingAdd">
            {{ $t("register") }}
          </v-btn>
          <v-btn class="error" @click="close()">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <PopUp ref="popUp" />
  </v-dialog>
</template>

<script>
import responseEval from "../Mixins/responseEval";
import AuthService from "../services/AuthenticationService";
import PopUp from "../components/PopUp.vue";
export default {
  mixins: [responseEval],
  components: {
    PopUp,
  },
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
      loadingAdd: false,
      dialog: false,
      user: {
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
    showPopUpMessage_Done() {
      this.$refs.popUp.open("done");
    },
    handleError(err) {
      // console.log("==============");
      // console.log(err.response.status);
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
    async addNewUser() {
      if (this.$refs.form.validate()) {
        this.loadingAdd = true;
        let response = null;
        try {
          response = await AuthService.register(this.user);
        } catch (err) {
          this.handleError(err);
        }
        if (this.isSuccessful(response)) {
          this.$refs.form.reset();
          this.showPopUpMessage_Done();
        }
        this.loadingAdd = false;
      }
    },
    close() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    open() {
      this.dialog = true;
    },
  },
};
</script>

<style>
</style>