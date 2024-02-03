import i18n from "../plugins/i18n";
export default {
  methods: {
    isOffline(err) {
      return err.toString() === "Error: Network Error" || !navigator.onLine;
    },
    isSuccessful(response) {
      return response != null && response.status == 200;
    },
    evalError(err) {
      if (this.isOffline(err)) {
        alert(i18n.t("Check your Internet connection and try again."));
        return;
      }
      const response = err.response;
      if (err.response != null) {
        switch (response.status) {
          case 400:
            alert(i18n.t("You sent invalid or bad data."));
            break;
          case 401:
            alert(i18n.t("Unauthorized."));
            break;
          case 403:
            alert(i18n.t("Your account has been disabled"));
            this.$router.push("/logout").catch(() => {});
            break;
          // case 409:
          // alert("Entered data must be unique"); //async register
          // break;
          case 500:
            alert(
              i18n.t(
                "An unknown error occured on our side. Please contact support."
              )
            );
            break;
        }
      }
    },
  },
};
