const _ = require("lodash");
const axios = require("axios");

const api = require("../utils/controller-api");
const db = require("../utils/db");
const constants = require("../utils/constants");

async function getNetworkAdditionalData(data) {
  let additionalData = db
    .get("networks")
    .find({ id: data.id })
    .get("additionalConfig");

  if (!additionalData.value()) {
    createNetworkAdditionalData(data.id);
  }

  delete data.rulesSource;
  delete data.objtype;
  delete data.revision;
  delete data.remoteTraceLevel;
  delete data.remoteTraceTarget;

  return {
    id: data.id,
    type: "Network",
    clock: Math.floor(new Date().getTime() / 1000),
    ...additionalData.value(),
    config: data,
  };
}

exports.getNetworksData = getNetworksData;
async function getNetworksData(nwids) {
  const prefix = "/controller/network/";
  const links = nwids.map((nwid) => prefix + nwid);

  const multipleRes = await axios
    .all(links.map((l) => api.get(l)))
    .then(
      axios.spread(function (...res) {
        return res;
      })
    )
    .catch(function () {
      return [];
    });

  let data = Promise.all(
    multipleRes.map((el) => {
      return getNetworkAdditionalData(el.data);
    })
  );

  return data;
}

exports.createNetworkAdditionalData = createNetworkAdditionalData;
async function createNetworkAdditionalData(nwid) {
  const saveData = {
    id: nwid,
    additionalConfig: {
      description: "",
      rulesSource: constants.defaultRulesSource,
      tagsByName: {},
      capabilitiesByName: {},
    },
    members: [],
  };

  db.get("networks").push(saveData).write();
}

exports.updateNetworkAdditionalData = updateNetworkAdditionalData;
async function updateNetworkAdditionalData(nwid, data) {
  let additionalData = {};

  if (data.hasOwnProperty("description")) {
    additionalData.description = data.description;
  }
  if (data.hasOwnProperty("rulesSource")) {
    additionalData.rulesSource = data.rulesSource;
  }
  if (data.hasOwnProperty("tagsByName")) {
    additionalData.tagsByName = data.tagsByName;
  }
  if (data.hasOwnProperty("capabilitiesByName")) {
    additionalData.capabilitiesByName = data.capabilitiesByName;
  }

  if (additionalData) {
    db.get("networks")
      .filter({ id: nwid })
      .map("additionalConfig")
      .map((additionalConfig) => _.assign(additionalConfig, additionalData))
      .write();
  }
}

exports.deleteNetworkAdditionalData = deleteNetworkAdditionalData;
async function deleteNetworkAdditionalData(nwid) {
  db.get("networks").remove({ id: nwid }).write();
}
