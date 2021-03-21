const api = require("../utils/controller-api");

module.exports = async function () {
  const res = await api.get("status");
  return res.data.address;
};
