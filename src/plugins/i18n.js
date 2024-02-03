import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}
export const languages = Object.getOwnPropertyNames(loadLocaleMessages());
export const selectedLocale = "bg" || navigator.language.split("-")[0]; //for dev
// export const selectedLocale = navigator.language.split("-")[0] || "en"; //for production
const dateTimeFormats = {
  en: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    },
  },
  bg: {
    short: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    },
  },
};
export default new VueI18n({
  dateTimeFormats,
  locale: selectedLocale,
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});
