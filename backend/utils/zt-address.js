import { api } from "../utils/controller-api.js";

export async function getZTAddress() {
  try {
    const res = await api.get("status");
    return res.data.address;
  } catch (err) {
    console.error(
      // @ts-ignore
      "Couldn't connect to the controller on " + err.config.baseURL
    );
  }
}
