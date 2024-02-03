import Api from "@/services/Api";

export default {
  get() {
    return Api().get("/business-details");
  },
  edit(body) {
    return Api().patch("/business-details", body);
  },
};
