<template>
  <v-expansion-panels rounded="lg" v-model="wow">
    <v-expansion-panel>
      <v-expansion-panel-header style="word-break: break-word"
        >{{ $t("Developer and Tech support") }}
      </v-expansion-panel-header>
      <v-scale-transition>
        <div style="border-top: 2px solid grey" v-if="wow != undefined"></div>
      </v-scale-transition>
      <v-expansion-panel-content id="content" style="font-size: 0.86em">
        <p class="pt-3">
          <b>{{ $t("contactForm.nameLabel") }}</b
          >: {{ $t("Ismail") }}
        </p>
        <p>
          <b>{{ $t("contactForm.emailLabel") }}</b
          >: {{ devMail }}
        </p>
        <p>
          <b>{{ $t("contactForm.phoneLabel") }}</b
          >: {{ devPhone }}
        </p>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  watch: {
    wow() {
      if (this.wow != undefined) {
        setTimeout(() => {
          this.$vuetify.goTo("#content");
        }, 10);
      }
    },
  },
  data() {
    return {
      wow: undefined,
      devMail: this.$store.getters.devMail,
      devPhone: this.$store.getters.devPhone,
    };
  },
};
</script>
