const _ = require("lodash");
const axios = require("axios");

const api = require("../utils/controller-api");
const db = require("../utils/db");
const getZTAddress = require("../utils/zt-address");

let ZT_ADDRESS = null;
getZTAddress().then(function (address) {
  ZT_ADDRESS = address;
});

async function getPeer(mid) {
  try {
    const peer = await api.get("peer/" + mid);
    return peer.data;
  } catch (err) {
    return;
  }
}

async function getMemberAdditionalData(data) {
  // DB BUG INITIALIZATION MIGRATION
  const network = db.get("networks").find({ id: data.nwid });
  network.defaults({ members: [] }).get("members").write();
  // END MIGRATION SECTION

  const additionalData = db
    .get("networks")
    .find({ id: data.nwid })
    .get("members")
    .find({ id: data.id })
    .get("additionalConfig")
    .value();

  const peer = await getPeer(data.id);
  let peerData = {};
  if (peer) {
    peerData.latency = peer.latency;
    if (peer.latency !== -1) peerData.online = 1;
    if (peer.latency == -1) peerData.online = 2;
    peerData.clientVersion = peer.version;
    if (peer.paths[0]) {
      peerData.lastOnline = peer.paths[0].lastReceive;
      peerData.physicalAddress = peer.paths[0].address.split("/")[0];
      peerData.physicalPort = peer.paths[0].address.split("/")[1];
    }
  } else {
    peerData.online = 0;
  }

  delete data.lastAuthorizedCredential;
  delete data.lastAuthorizedCredentialType;
  delete data.objtype;
  delete data.remoteTraceLevel;
  delete data.remoteTraceTarget;

  return {
    id: data.nwid + "-" + data.id,
    type: "Member",
    clock: Math.floor(new Date().getTime() / 1000),
    networkId: data.nwid,
    nodeId: data.id,
    controllerId: ZT_ADDRESS,
    ...additionalData,
    ...peerData,
    config: data,
  };
}

async function filterDeleted(nwid, mid) {
  const member = db
    .get("networks")
    .find({ id: nwid })
    .get("members")
    .find({ id: mid });

  if (!member.get("deleted").value()) return mid;
  else return;
}

exports.getMembersData = getMembersData;
async function getMembersData(nwid, mids) {
  const prefix = "/controller/network/" + nwid + "/member/";
  const filtered = (
    await Promise.all(mids.map(async (mid) => await filterDeleted(nwid, mid)))
  ).filter((item) => item !== undefined);
  const links = filtered.map((mid) => prefix + mid);

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
      return getMemberAdditionalData(el.data);
    })
  );

  return data;
}

exports.updateMemberAdditionalData = updateMemberAdditionalData;
async function updateMemberAdditionalData(nwid, mid, data) {
  if (data.config && data.config.authorized) {
    db.get("networks")
      .filter({ id: nwid })
      .map("members")
      .first()
      .filter({ id: mid })
      .first()
      .set("deleted", false)
      .write();
  }

  let additionalData = {};

  if (data.hasOwnProperty("name")) {
    additionalData.name = data.name;
  }
  if (data.hasOwnProperty("description")) {
    additionalData.description = data.description;
  }

  if (additionalData) {
    const member = db
      .get("networks")
      .filter({ id: nwid })
      .map("members")
      .first()
      .filter({ id: mid });
    if (member.value().length) {
      member
        .map("additionalConfig")
        .map((additionalConfig) => _.assign(additionalConfig, additionalData))
        .write();
    } else {
      additionalData = { name: "", description: "" };

      if (data.hasOwnProperty("name")) {
        additionalData.name = data.name;
      }
      if (data.hasOwnProperty("description")) {
        additionalData.description = data.description;
      }
      db.get("networks")
        .filter({ id: nwid })
        .map("members")
        .first()
        .push({ id: mid, additionalConfig: additionalData })
        .write();
    }
  }
}

exports.deleteMemberAdditionalData = deleteMemberAdditionalData;
async function deleteMemberAdditionalData(nwid, mid) {
  // ZT controller bug
  /* db.get("networks")
       .find({ id: nwid })
       .get("members")
       .remove({ id: mid })
       .write();
  */

  db.get("networks")
    .filter({ id: nwid })
    .map("members")
    .first()
    .filter({ id: mid })
    .first()
    .set("deleted", true)
    .write();
}
