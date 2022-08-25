import axios from "axios";

const baseURL = "/api/";

export default axios.create({
  baseURL: baseURL,
  responseType: "json",
  withCredentials: "true",
  headers:
    localStorage.getItem("disableAuth") === "true"
      ? {}
      : {
          Authorization: `token ${JSON.parse(localStorage.getItem("token"))}`,
        },
});
