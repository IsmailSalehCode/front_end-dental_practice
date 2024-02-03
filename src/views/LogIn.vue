<template>
  <v-container>
    <v-card max-width="400px" class="mx-auto" elevation="6">
      <v-card-title class="justify-center darkCardTitle">
        {{ $t("staff-portal") }}
      </v-card-title>

      <hr />
      <v-card-text class="pb-1">
        <v-form
          @submit.prevent
          ref="loginForm"
          @submit="login()"
          :disabled="loadingLogin"
        >
          <v-col>
            <v-row justify="center">
              <v-text-field
                autocomplete="username"
                v-model.trim="username"
                validate-on-blur
                prepend-icon="mdi-account"
                :rules="[rules.required, rules.max(100), rules.min(3)]"
                :label="$t('username')"
              />
            </v-row>
            <v-row justify="center" class="pt-3">
              <v-text-field
                autocomplete="current-password"
                v-model.trim="password"
                validate-on-blur
                prepend-icon="mdi-lock"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min(8), rules.max(32)]"
                :type="showPass ? 'text' : 'password'"
                :label="$t('password')"
                hint="Min 8, Max 32"
                counter
                @click:append="showPass = !showPass"
              />
            </v-row>

            <br />
            <v-row justify="center">
              <v-col justify="center" class="pb-2">
                <v-row style="justify-content: center">
                  <v-col class="pb-3" justify="center" align="center">
                    <vue-recaptcha
                      ref="recaptcha"
                      :sitekey="captchaSiteKey"
                      theme="light"
                      :language="selectedLocale"
                      :loadRecaptchaScript="true"
                      @verify="enablePosting"
                      @expired="disablePosting"
                    ></vue-recaptcha>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-card-actions style="justify-content: center">
            <v-btn
              :disabled="captchaToken ? false : true"
              :color="captchaToken ? 'info' : ''"
              type="submit"
              :loading="loadingLogin"
              >{{ $t("logInTitle") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
import responseEval from "@/Mixins/responseEval";
import VueRecaptcha from "vue-recaptcha";
export default {
  computed: {
    selectedLocale() {
      return this.$store.state.locale;
    },
  },
  components: {
    VueRecaptcha,
  },
  mixins: [responseEval],
  data() {
    return {
      captchaSiteKey: this.$store.getters.captchaSiteKey,
      captchaToken: null,
      loadingLogin: false,
      showPass: false,
      rules: this.$store.getters.rules,
      username: "",
      password: "",
    };
  },
  methods: {
    enablePosting(response) {
      this.captchaToken = response;
    },
    disablePosting() {
      this.captchaToken = null;
      this.$refs.recaptcha.reset();
    },
    async login() {
      this.loadingLogin = true;

      if (this.$refs.loginForm.validate() && this.captchaToken != null) {
        let response;
        try {
          response = await AuthenticationService.login(this.captchaToken, {
            username: this.username,
            password: this.password,
          });
        } catch (err) {
          this.disablePosting();
          this.evalError(err);
          this.loadingLogin = false;
          return;
        }
        if (this.isSuccessful(response)) {
          this.$store.dispatch("setToken", response.data.token);
          this.$store.dispatch("setUser", response.data.user);
          this.$router.push("/personnel-dash").catch(() => {});
        }
      } else {
        alert("Invalid login");
      }

      this.loadingLogin = false;
    },
  },
};
</script>

<style scoped>
.v-text-field {
  max-width: 290px;
}
</style>
