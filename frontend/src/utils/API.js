import axios from "axios";

const baseURL = "/api/";

export default axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers:
    localStorage.getItem("disableAuth") === "true"
      ? {}
      : {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
});
