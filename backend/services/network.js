const _ = require("lodash");
const axios = require("axios");

const api = require("../utils/controller-api");
const db = require("../utils/db");
const constants = require("../utils/constants");
const zns = require("../utils/zns");

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

  //let ad = { ...additionalData.value() };
  let ad_ = additionalData.value();
  let ad = JSON.parse(JSON.stringify(ad_));
  data.dns = {
    domain: ad_.dnsDomain,
    servers: [],
  };
  if (ad_.dnsIP) data.dns["servers"].push(ad_.dnsIP);
  console.log(
    `*** ad_="${JSON.stringify(ad_, null, 3)}" -> ad="${JSON.stringify(
      ad,
      null,
      3
    )}" -> ${JSON.stringify(data.dns, null, 3)}`
  );
  delete ad.dnsIP;
  delete ad.dnsDomain;
  delete ad.dnsEnable;
  delete ad.dnsWildcard;
  return {
    id: data.id,
    type: "Network",
    clock: Math.floor(new Date().getTime() / 1000),
    ...ad,
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

  return Promise.all(
    multipleRes.map((el) => {
      return getNetworkAdditionalData(el.data);
    })
  );
}

exports.createNetworkAdditionalData = createNetworkAdditionalData;
async function createNetworkAdditionalData(nwid) {
  const saveData = {
    id: nwid,
    additionalConfig: {
      description: "",
      rulesSource: constants.defaultRulesSource,
      dnsEnable: false,
      dnsDomain: "",
      dnsWildcard: false,
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
  if (data.hasOwnProperty("dnsEnable")) {
    if (data.dnsEnable) {
      //TODO: start ZeroNSd and get its IP address
      additionalData.dnsIP = "127.0.0.1";
    } else {
      additionalData.dnsIP = null;
    }
    additionalData.dnsEnable = data.dnsEnable;
  }
  if (data.hasOwnProperty("dnsDomain")) {
    additionalData.dnsDomain = data.dnsDomain;
  }
  if (data.hasOwnProperty("dnsWildcard")) {
    additionalData.dnsWildcard = data.dnsWildcard;
  }

  if (additionalData) {
    db.get("networks")
      .filter({ id: nwid })
      .map("additionalConfig")
      .map((additionalConfig) => _.assign(additionalConfig, additionalData))
      .write();

    if (data.hasOwnProperty("dnsEnable")) {
      zns.handleNet(db.get("networks").filter({ id: nwid }).value()[0]);
    }
  }
}

exports.deleteNetworkAdditionalData = deleteNetworkAdditionalData;
async function deleteNetworkAdditionalData(nwid) {
  db.get("networks").remove({ id: nwid }).write();
}
