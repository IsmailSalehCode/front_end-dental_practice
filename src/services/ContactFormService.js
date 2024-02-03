import Api from "@/services/Api";

export default {
  deleteForm(id) {
    return Api().delete(`contact-forms/delete/${id}`);
  },
  getForms() {
    return Api().get("/all-contact-forms");
  },
  addForm(token, form) {
    return Api().post("/contact-forms", form, {
      headers: {
        captcha: token,
      },
    });
  },
};
