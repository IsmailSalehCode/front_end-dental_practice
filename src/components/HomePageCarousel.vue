<template>
  <v-card dark elevation="0" :max-width="cardMaxWidth" class="mx-auto" tile>
    <v-carousel
      height="auto"
      cycle
      hide-delimiter-background
      show-arrows-on-hover
      delimiter-icon="mdi-minus"
      eager
    >
      <v-carousel-item v-for="pic in pics" :key="pic.id" eager>
        <v-img
          style="background-color: #262626"
          height="100%"
          width="100%"
          eager
          :src="pic.src"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="blue"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  computed: {
    cardMaxWidth() {
      let width = "1000";

      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          width = 500;
          break;
        case "sm":
          width = 750;
          break;
        case "md":
        case "lg":
          width = 900;
          break;
        case "xl":
          width = 1060;
          break;
      }
      // console.log(this.$vuetify.breakpoint.name);
      return width;
    },
  },
  data() {
    return {
      pics: [
        { id: 1, src: "https://blueskyinvest.xyz/dentist-pics/1.jpg" },
        { id: 2, src: "https://blueskyinvest.xyz/dentist-pics/2.jpg" },
        { id: 3, src: "https://blueskyinvest.xyz/dentist-pics/3.jpg" },
        { id: 4, src: "https://blueskyinvest.xyz/dentist-pics/4.jpg" },
        { id: 5, src: "https://blueskyinvest.xyz/dentist-pics/5.jpg" },
        { id: 6, src: "https://blueskyinvest.xyz/dentist-pics/6.jpg" },
        { id: 7, src: "https://blueskyinvest.xyz/dentist-pics/7.jpg" },
      ],
    };
  },
};
</script>

<style scoped></style>
