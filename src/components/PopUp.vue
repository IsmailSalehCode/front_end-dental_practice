<template>
  <v-snackbar timeout="2000" class="text-center ma-2" v-model="popUp">
    <div>
      {{ $t(message) }}
      <!-- <div v-if="message == 'thankYouForVote'"> -->
      {{ randomCelebration() }}
      <!-- </div> -->
    </div>
    <template v-slot:action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="close()">
        {{ $t("close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      popUp: false,
      message: "",
      celebrations: [
        "☚(ﾟヮﾟ☚)",
        "(⌐■_■)",
        "( ͡°_ʖ −)☆",
        "\\ (•◡•) /",
        "◕‿↼",
        "シ",
        "ヽ(´▽`)/",
        "d–(^ ‿ ^ )z",
        "ヾ(´〇`)ﾉ♪♪♪",
        "ᕙ(⇀‸↼‶)ᕗ",
      ],
    };
  },
  methods: {
    randomCelebration() {
      const arr = this.celebrations;
      return arr[Math.floor(Math.random() * arr.length)];
    },
    open(msg) {
      this.message = msg;
      this.popUp = true;
    },
    close() {
      this.popUp = false;
    },
  },
};
</script>

<style>
</style>