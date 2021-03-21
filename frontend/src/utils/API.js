import axios from "axios";

const baseURL = "/api/";

export default axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  },
});
