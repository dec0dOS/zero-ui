import express from "express";
const router = express.Router();

import { isAuthorized } from "../services/auth.js";
import {
  getNetworksData,
  createNetworkAdditionalData,
  updateNetworkAdditionalData,
  deleteNetworkAdditionalData,
} from "../services/network.js";

import { api } from "../utils/controller-api.js";
import { defaultRules } from "../utils/constants.js";
import { getZTAddress } from "../utils/zt-address.js";

let ZT_ADDRESS = null;
getZTAddress().then(function (address) {
  ZT_ADDRESS = address;
});

// get all networks
router.get("/", isAuthorized, async function (req, res) {
  api.get("controller/network").then(async function (controllerRes) {
    const nwids = controllerRes.data;
    const data = await getNetworksData(nwids);
    res.send(data);
  });
});

// get network
router.get("/:nwid", isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  const data = await getNetworksData([nwid]);
  if (data[0]) {
    res.send(data[0]);
  } else {
    res.status(404).send({ error: "Network not found" });
  }
});

// create new network
router.post("/", isAuthorized, async function (req, res) {
  let reqData = req.body;
  if (reqData.config) {
    const config = reqData.config;
    delete reqData.config;
    reqData = config;
    reqData.rules = JSON.parse(defaultRules);
  } else {
    res.status(400).send({ error: "Bad request" });
  }
  api
    .post("controller/network/" + ZT_ADDRESS + "______", reqData)
    .then(async function (controllerRes) {
      await createNetworkAdditionalData(controllerRes.data.id);
      const data = await getNetworksData([controllerRes.data.id]);
      res.send(data[0]);
    });
});

// update network
router.post("/:nwid", isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  updateNetworkAdditionalData(nwid, req.body);
  if (req.body.config) {
    api
      .post("controller/network/" + nwid, req.body.config)
      .then(async function () {
        const data = await getNetworksData([nwid]);
        res.send(data[0]);
      })
      .catch(function (err) {
        res.status(500).send({ error: err.message });
      });
  } else {
    const data = await getNetworksData([nwid]);
    res.send(data[0]);
  }
});

// delete network
router.delete("/:nwid", isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  deleteNetworkAdditionalData(nwid);
  api
    .delete("controller/network/" + nwid)
    .then(function (controllerRes) {
      res.status(controllerRes.status).send("");
    })
    .catch(function (err) {
      res.status(500).send({ error: err.message });
    });
});

export default router;
