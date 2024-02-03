<template>
  <div>
    <v-container
      fluid
      class="pa-0 ma-0"
      align="center"
      justify="center"
      style="background-color: rgb(21, 21, 21); color: rgb(228, 228, 228)"
    >
      <HomePageCarousel />
    </v-container>
    <v-container
      fluid
      style="
        text-align: center;
        padding: 15px !important;
        background-color: black;
        color: white;
        font-size: 0.92em;
      "
      ;
    >
      <h4>
        <i>
          {{ "\“" + $t(randomQuote.quote) + "\”" }}
        </i>
      </h4>
      <h5 class="pt-2">
        <i>- {{ $t(randomQuote.author) }}</i>
      </h5>
    </v-container>
    <v-container style="text-align: center">
      <v-col cols="12">
        <v-btn rounded color="#E7CA71" to="/make-an-appointment">{{
          $t("make an appointment")
        }}</v-btn>
      </v-col>
    </v-container>
    <!-- Dental Services -->
    <v-container style="max-width: 450px">
      <v-container style="text-align: center">
        <h3>
          {{ $t("Dental Services") }}
        </h3>
      </v-container>
      <v-expansion-panels tile focusable accordion v-model="servicePanels">
        <v-expansion-panel
          :id="service.title"
          v-for="service in services"
          :key="service.title"
        >
          <v-expansion-panel-header style="word-break: break-word">{{
            $t(service.title)
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <ul style="font-size: 0.9em; padding-top: 9px">
              <li
                v-for="bulletPoint in service.bulletPoints"
                :key="bulletPoint"
                style="word-break: break-word"
              >
                {{ $t(bulletPoint) }}
              </li>
            </ul>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <!-- End of Dental Services -->
    <!-- You have a question? button -->
    <v-container style="text-align: center">
      <v-col cols="12">
        <v-btn tile to="/contact" color="black" outlined depressed>{{
          $t("You have a question?")
        }}</v-btn>
      </v-col>
    </v-container>
    <br />
    <hr />
    <ContactInfo />
    <br />
    <br />
    <br />
  </div>
</template>

<script>
import HomePageCarousel from "../components/HomePageCarousel.vue";
import ContactInfo from "../components/ContactInfo.vue";
export default {
  watch: {
    servicePanels() {
      if (this.servicePanels != undefined) {
        //  scroll to opened panel
        const serviceTitle = this.services[this.servicePanels].title;
        setTimeout(() => {
          const element = document.getElementById(serviceTitle);
          element.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
          });
        }, 500);
      }
    },
  },
  data() {
    return {
      servicePanels: undefined,
      services: [
        {
          title: "General",
          bulletPoints: [
            "CLEANINGS & EXAMS",
            "EMERGENCY CARE",
            "CROWNS",
            "GUM THERAPY",
          ],
        },
        {
          title: "Cosmetic",
          bulletPoints: ["INVISALIGN", "TEETH WHITENING", "BONDING", "VENEERS"],
        },
        {
          title: "Surgical",
          bulletPoints: [
            "IMPLANTS",
            "EXTRACTIONS",
            "ROOT CANAL",
            "BONE GRAFTS",
          ],
        },
      ],
      quotes: [
        {
          quote:
            "Often joy is the source of a smile, but other times your smile can be the source of joy.",
          author: "Thich Nhat Hanh",
        },
        {
          quote: "An enigmatic smile is worth ten pages of dialogue.",
          author: "Connie Brockway",
        },
        {
          quote: "A smile is the best way to get away with trouble",
          author: "Masashi Kishimoto",
        },
        {
          quote:
            "Share your smile with the world. It’s a symbol of friendship and peace.",
          author: "Christie Brinkley",
        },
        {
          quote: "Everyone smiles in the same language.",
          author: "George Carlin",
        },
      ],
    };
  },
  computed: {
    randomQuote() {
      const arr = this.quotes;
      return arr[Math.floor(Math.random() * arr.length)];
    },
  },
  components: {
    HomePageCarousel,
    ContactInfo,
  },
};
</script>

<style>
</style>