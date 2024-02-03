import Api from "@/services/Api";

export default {
  get() {
    return Api().get("/site-config-details");
  },
  edit(body) {
    return Api().patch("/site-config-details", body);
  },
};
