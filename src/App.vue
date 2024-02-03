<template>
  <v-app :style="appStyle">
    <v-app-bar hide-on-scroll id="appBar" app>
      <v-toolbar-title @click="redirectToMain" class="pointerOnHover">
        <v-img :src="logo" style="width: 93px"> </v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          color="white"
          text
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          {{ $t(item.title) }}
        </v-btn>
      </v-toolbar-items>
      <v-menu dark rounded="b-xl t-0" offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn small outlined dark v-bind="attrs" v-on="on">
            {{ selectedLang }}
          </v-btn>
        </template>

        <v-list>
          <template v-for="(lang, index) in languages">
            <v-list-item
              :key="lang.title"
              @click="changeLocale(lang.language)"
              dense
            >
              <v-list-item-icon>
                <v-img
                  max-height="24px"
                  max-width="24px"
                  contain
                  :src="require(`${lang.icon}`)"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="lang.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider
              v-if="lang.divider"
              :key="index"
              color="white"
              :inset="true"
            ></v-divider>
          </template>
        </v-list>
      </v-menu>
      <span class="hidden-md-and-up">
        <v-app-bar-nav-icon dark right @click="drawer = !drawer">
        </v-app-bar-nav-icon>
      </span>
    </v-app-bar>

    <v-main>
      <!-- SDC alert -->
      <div v-if="SiteDesignConfig.wants_webMessage">
        <v-alert
          tile
          style="margin-bottom: 0px"
          :type="SiteDesignConfig.type_webMessage"
          :prominent="Boolean(SiteDesignConfig.isProminent_webMessage)"
          :dense="Boolean(SiteDesignConfig.isDense_webMessage)"
        >
          {{ SiteDesignConfig.text_webMessage }}
        </v-alert>
      </div>
      <!-- END OF SDC alert -->
      <router-view></router-view>
    </v-main>

    <v-navigation-drawer
      app
      color="rgb(14, 14, 14)"
      v-model="drawer"
      dark
      right
      temporary
    >
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-content :style="{ 'text-align': 'center' }">
            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-footer bottom absolute app dark>
      <v-col cols="12" class="text-center">
        <v-row align="center" justify="center">
          <v-col
            align="center"
            justify="center"
            class="text-center"
            style="font-size: 0.8rem"
          >
            &#169; {{ new Date().getFullYear() }} -
            <strong>Е. Д. Илиеви</strong>.
            {{ $t("rightsReserved") }}
          </v-col>
        </v-row>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
// import responseEval from "@/Mixins/responseEval";
import i18n from "./plugins/i18n";
import { mapState } from "vuex";
export default {
  mounted() {
    this.$store.dispatch("refreshSiteDesignConfigData");
  },
  name: "App",
  // mixins: [responseEval],
  data() {
    return {
      logo: require("./assets/logo.png"),
      languages: [
        {
          icon: "./flags/bg.png",
          language: "bg",
          title: "Български",
          divider: true,
        },
        {
          icon: "./flags/uk.png",
          language: "en",
          title: "English",
          divider: false,
        },
      ],
      drawer: false,
    };
  },
  computed: {
    SiteDesignConfig() {
      return this.$store.state.sdc;
    },
    isRelationsDialogFullscreen() {
      let result = true;
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          result = true;
          break;
        case "md":
        case "lg":
        case "xl":
          result = false;
          break;
      }
      return result;
    },
    appStyle() {
      switch (this.$route.path) {
        case "/personnel-dash":
          return "background-image: linear-gradient(to right, #434343 0%, black 100%);";
      }
      return null;
    },
    ...mapState(["locale"]),
    menuItems() {
      let menuItems = null;
      const defaultMenuItems = [
        { title: "home", path: "/" },
        // { title: "make an appointment", path: "/make-an-appointment" },
        { title: "my-appointments", path: "/my-appointments" },
        { title: "contact", path: "/contact" },
      ];
      const unAuthenticatedMenuItems = [
        { title: "logInTitle", path: "/login" },
      ];
      const authenticatedMenuItems = [
        { title: "dashboardTitle", path: "/personnel-dash" },
        { title: "signOutTitle", path: "/logout" },
      ];
      menuItems = defaultMenuItems;
      if (this.$store.state.isUserLoggedIn) {
        menuItems = menuItems.concat(authenticatedMenuItems);
      } else {
        menuItems = menuItems.concat(unAuthenticatedMenuItems);
      }
      return menuItems;
    },
    selectedLang() {
      return i18n.locale.toUpperCase();
    },
  },
  methods: {
    copy(txt) {
      navigator.clipboard.writeText(txt);
      alert(txt + " " + i18n.t("hasBeenCopied"));
    },
    redirectToMain() {
      this.$router.push("/").catch(() => {});
    },
    changeLocale(locale) {
      this.$store.dispatch("changeLocale", locale);
    },
  },
};
</script>
<style>
.pointerOnHover :hover {
  cursor: pointer;
}
html {
  overflow-y: auto;
  scroll-behavior: smooth;
}
.v-application {
  font-family: "Roboto", Times, serif !important;
}
#footerLink {
  color: white;
  text-decoration: none;
  font-size: 12px;
}
#appBar {
  background-color: rgb(14, 14, 14);
}
.v-btn--active.no-active::before {
  opacity: 0 !important;
}
</style>