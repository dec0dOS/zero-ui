import _ from "lodash";
import axios from "axios";

import { api } from "../utils/controller-api.js";
import { db } from "../utils/db.js";
import { getZTAddress } from "../utils/zt-address.js";

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

  const member = db
    .get("networks")
    .find({ id: data.nwid })
    .get("members")
    .find({ id: data.id });

  const additionalData = member.get("additionalConfig").value() || {};
  const lastOnline = member.get("lastOnline").value() || 0;

  const peer = await getPeer(data.id);
  let peerData = {};
  if (peer && !_.isEmpty(peer)) {
    peerData.latency = peer.latency;
    if (peer.latency !== -1) peerData.online = 1;
    if (peer.latency == -1) peerData.online = 2;
    peerData.clientVersion = peer.version;
    if (peer.paths.length > 0) {
      let path = peer.paths.filter((p) => {
        let ret = p.active && !p.expired;
        if (typeof p.preferred !== "undefined") {
          ret = ret && p.preferred;
        }
        return ret;
      });
      if (path.length > 0) {
        peerData.lastOnline = path[0].lastReceive;
        peerData.physicalAddress = path[0].address.split("/")[0];
        peerData.physicalPort = path[0].address.split("/")[1];
      }
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
    clock: new Date().getTime(),
    networkId: data.nwid,
    nodeId: data.id,
    controllerId: ZT_ADDRESS,
    // @ts-ignore
    lastOnline: lastOnline,
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

  let deleted = member.get("deleted").value() || false;
  if (!deleted) return mid;
  else return;
}

export async function getMembersData(nwid, mids) {
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
    .catch(function (err) {
      return [];
    });

  let data = Promise.all(
    multipleRes.map((el) => {
      return getMemberAdditionalData(el.data);
    })
  );

  return data;
}

export async function updateMemberAdditionalData(nwid, mid, data) {
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

export async function deleteMemberAdditionalData(nwid, mid) {
  // ZT controller bug
  /* db.get("networks")
       .find({ id: nwid })
       .get("members")
       .remove({ id: mid })
       .write();
  */

  await updateMemberAdditionalData(nwid, mid, {});

  db.get("networks")
    .filter({ id: nwid })
    .map("members")
    .first()
    .filter({ id: mid })
    .first()
    .set("deleted", true)
    .write();
}
