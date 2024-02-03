import axios from "axios";
import store from "@/store";

export default () => {
  const url = process.env.VUE_APP_BASE_URL;
  return axios.create({
    baseURL: url || "http://localhost:8098/",
    headers: {
      Authorization: `Bearer ${store.state.token}`,
    },
  });
};
