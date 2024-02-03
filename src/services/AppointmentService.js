import Api from "@/services/Api";

export default {
  deleteForm(id) {
    return Api().delete(`appointments/delete/${id}`);
  },
  getForms() {
    return Api().get("/appointments");
  },
  addForm(form) {
    return Api().post("/appointment", form);
  },
  addDateTime(datetime) {
    return Api().post("/appointment-datetime", datetime);
  },
  deleteDateTime(id) {
    return Api().delete(`/appointment-datetime/delete/${id}`);
  },
  getAvailableDateTimes() {
    return Api().get("/available-datetimes");
  },
  getAllDateTimes() {
    return Api().get("/all-datetimes");
  },
  getSpecificForm(id) {
    return Api().get(`/specific-appointment/${id}`);
  },
};
