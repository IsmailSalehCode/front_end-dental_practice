import Api from "@/services/Api";

export default {
  register(credentials) {
    return Api().post("/register", credentials);
  }, //add user
  login(token, credentials) {
    return Api().post("/login", credentials, {
      headers: {
        captcha: token,
      },
    });
  },
};
