import express from "express";
const router = express.Router({ mergeParams: true });

import { isAuthorized } from "../services/auth.js";
import {
  deleteMemberAdditionalData,
  getMembersData,
  updateMemberAdditionalData,
} from "../services/member.js";

import { api } from "../utils/controller-api.js";

// get all members
router.get("/", isAuthorized, async function (req, res) {
  // @ts-ignore
  const nwid = req.params.nwid;
  api
    .get("controller/network/" + nwid + "/member")
    .then(async function (controllerRes) {
      const mids = Object.keys(controllerRes.data);
      const data = await getMembersData(nwid, mids);
      res.send(data);
    })
    .catch(function (err) {
      res.status(404).send({ error: `Network not found ${err}` });
    });
});

// get member
router.get("/:mid", isAuthorized, async function (req, res) {
  // @ts-ignore
  const nwid = req.params.nwid;
  const mid = req.params.mid;
  const data = await getMembersData(nwid, [mid]);
  if (data[0]) {
    res.send(data[0]);
  } else {
    res.status(404).send({ error: "Member not found" });
  }
});

// update member
router.post("/:mid", isAuthorized, async function (req, res) {
  // @ts-ignore
  const nwid = req.params.nwid;
  const mid = req.params.mid;
  updateMemberAdditionalData(nwid, mid, req.body);
  if (req.body.config) {
    api
      .post("controller/network/" + nwid + "/member/" + mid, req.body.config)
      .then(async function () {
        const data = await getMembersData(nwid, [mid]);
        res.send(data[0]);
      })
      .catch(function (err) {
        res.status(500).send({ error: err.message });
      });
  } else {
    const data = await getMembersData(nwid, [mid]);
    res.send(data[0]);
  }
});

// delete member
router.delete("/:mid", isAuthorized, async function (req, res) {
  // @ts-ignore
  const nwid = req.params.nwid;
  const mid = req.params.mid;
  deleteMemberAdditionalData(nwid, mid);
  api
    .delete("controller/network/" + nwid + "/member/" + mid)
    .then(function () {})
    .catch(function (err) {
      res.status(500).send({ error: err.message });
    });
  // Need this to fix ZT controller bug https://github.com/zerotier/ZeroTierOne/issues/859
  const defaultConfig = {
    authorized: false,
    ipAssignments: [],
    capabilities: [],
    tags: [],
  };
  api
    .post("controller/network/" + nwid + "/member/" + mid, defaultConfig)
    .then(function (controllerRes) {
      res.status(controllerRes.status).send("");
    })
    .catch(function (err) {
      res.status(500).send({ error: err.message });
    });
});

export default router;
