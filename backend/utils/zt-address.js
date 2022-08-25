const api = require("../utils/controller-api");

module.exports = async function () {
  try {
    const res = await api.get("status");
    return res.data.address;
  } catch (err) {
    console.error(
      "Couldn't connect to the controller on " + err.config.baseURL
    );
  }
};
