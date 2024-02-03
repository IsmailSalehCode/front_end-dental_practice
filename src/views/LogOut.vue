<template>
  <div>
    <h1>Logging you out...</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    //test if after logging in and out for a second time, shit will work
    this.$store.dispatch("setToken", null);
    this.$store.dispatch("setUser", null);
    this.$router.push("/").catch(() => {});
  },
};
</script>