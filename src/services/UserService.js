import Api from "@/services/Api";

export default {
  getUsers() {
    return Api().get("users");
  },

  deleteUser(id) {
    return Api().delete(`users/delete/${id}`);
  },

  toggleUser(id) {
    return Api().patch(`users/toggle/${id}`);
  },

  editUser(id, body) {
    return Api().patch(`users/edit/${id}`, body);
  },
};
