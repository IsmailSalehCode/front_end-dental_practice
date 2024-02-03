import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import i18n, { selectedLocale } from "@/plugins/i18n";
import SiteDesignConfigService from "./services/SiteDesignConfigService";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    locale: selectedLocale,
    token: null,
    user: null,
    isUserLoggedIn: false,
    myAppointments: [],
    sdc: {},
  },

  getters: {
    availableTypes_alert() {
      return [
        { value: "success", text: i18n.t("success") },
        { value: "info", text: i18n.t("info") },
        { value: "warning", text: i18n.t("warning") },
        { value: "error", text: i18n.t("error") },
      ];
    },
    availableRoles() {
      return [
        {
          value: "Manager",
          text: i18n.t("Manager"),
        },
        {
          value: "Employee",
          text: i18n.t("Employee"),
        },
      ];
    },
    availableProcedures() {
      return [
        { value: "not sure", text: i18n.t("not sure") },
        { value: "emergency/tooth pain", text: i18n.t("emergency/tooth pain") },
        {
          value: "dental implants consult",
          text: i18n.t("dental implants consult"),
        },
        { value: "invisalign consult", text: i18n.t("invisalign consult") },
        { value: "teeth whitening", text: i18n.t("teeth whitening") },
        { value: "teeth cleaning adult", text: i18n.t("teeth cleaning adult") },
        { value: "teeth cleaning child", text: i18n.t("teeth cleaning child") },
        // "not sure",
        // "emergency/tooth pain",
        // "dental implants consult",
        // "invisalign consult",
        // "teeth whitening",
        // "teeth cleaning adult",
        // "teeth cleaning child",
      ];
    },
    address() {
      return 'ul. "Ami Boue" 27, 1606 Kriva Reka, Sofia';
    },
    captchaSiteKey() {
      return process.env.VUE_APP_CAPTCHA_KEY;
    },
    devPhone() {
      return "088 990 7045";
    },
    devMail() {
      return "centriu78@gmail.com";
    },
    rules() {
      const rules = {
        required: (v) => !!v || i18n.t("rules.required"),
        password: (v) =>
          (v &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$.#!%*?&])[A-Za-z\d@^$!.#%*?&({})_/'"]{8,32}$/.test(
              v
            )) ||
          i18n.t("rules.validPasswordFormat"),
        //used in registration but not in login (on purpose)
        onlyLetters: (v) =>
          (v && /^([^0-9!@#$%^&*()\-_+/\\,.<>='"|{};[\]]*)$/.test(v)) || //works here but in regex101 it wants '/' to be escaped-> '\/'
          i18n.t("rules.onlyLetters"),
        max(maxNum) {
          return (v) =>
            (v || "").toString().length <= maxNum ||
            i18n.t("rules.maxTxtLength");
        },
        min(minNum) {
          return (v) =>
            (v || "").toString().length >= minNum ||
            i18n.t("rules.minTxtLength");
        },
        isPdf: (v) =>
          (v && /^.+\.(([pP][dD][fF]))$/.test(v)) || i18n.t("rules.pdfOnly"),
      };
      return rules;
    },
    emailRules() {
      const emailRules = [
        (v) => !!v || i18n.t("rules.required"),
        (v) =>
          (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
            v
          ) &&
            v.length <= 320) ||
          "Невалиден е-мейл",
      ];
      return emailRules;
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isUserLoggedIn = !!token;
    },
    setUser(state, user) {
      state.user = user;
    },
    updateLocale(state, newLocale) {
      state.locale = newLocale;
    },
    updateSDC(state, newSDC) {
      state.sdc = newSDC;
    },
    addToBeginningOfMyAppointments(state, newAppointment) {
      state.myAppointments.unshift(newAppointment);
    },
    removeAppointmentFromMyAppointments(state, targetDatetime) {
      const array = state.myAppointments;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.datetime == targetDatetime) {
          array.splice(i, 1);
          return;
        }
      }
    },
  },
  actions: {
    setToken({ commit }, token) {
      commit("setToken", token);
    },
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    changeLocale({ commit }, newLocale) {
      i18n.locale = newLocale;
      commit("updateLocale", newLocale);
    },

    addToMyAppointments({ commit }, newAppointment) {
      commit("addToBeginningOfMyAppointments", newAppointment);
    },
    removeFromMyAppointments({ commit }, targetDatetime) {
      commit("removeAppointmentFromMyAppointments", targetDatetime);
    },
    async refreshSiteDesignConfigData() {
      let response = null;
      let sdc = null;
      try {
        response = await SiteDesignConfigService.get();
      } catch (err) {
        this.evalError(err);
      }
      if (response != null && response.status == 200) {
        sdc = response.data;
        this.commit("updateSDC", sdc);
      }
    },
  },
});
