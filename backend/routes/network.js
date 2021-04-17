const express = require("express");
const router = express.Router();

const auth = require("../services/auth");
const network = require("../services/network");

const api = require("../utils/controller-api");
const constants = require("../utils/constants");
const getZTAddress = require("../utils/zt-address");

let ZT_ADDRESS = null;
getZTAddress().then(function (address) {
  ZT_ADDRESS = address;
});

// get all networks
router.get("/", auth.isAuthorized, async function (req, res) {
  api.get("controller/network").then(async function (controllerRes) {
    const nwids = controllerRes.data;
    const data = await network.getNetworksData(nwids);
    res.send(data);
  });
});

// get network
router.get("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  const data = await network.getNetworksData([nwid]);
  if (data[0]) {
    res.send(data[0]);
  } else {
    res.status(404).send({ error: "Network not found" });
  }
});

// create new network
router.post("/", auth.isAuthorized, async function (req, res) {
  let reqData = req.body;
  if (reqData.config) {
    const config = reqData.config;
    delete reqData.config;
    reqData = config;
    reqData.rules = JSON.parse(constants.defaultRules);
  } else {
    res.status(400).send({ error: "Bad request" });
  }
  api
    .post("controller/network/" + ZT_ADDRESS + "______", reqData)
    .then(async function (controllerRes) {
      await network.createNetworkAdditionalData(controllerRes.data.id);
      const data = await network.getNetworksData([controllerRes.data.id]);
      res.send(data[0]);
    });
});

// update network
router.post("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  network.updateNetworkAdditionalData(nwid, req.body);
  if (req.body.config) {
    api
      .post("controller/network/" + nwid, req.body.config)
      .then(async function () {
        const data = await network.getNetworksData([nwid]);
        res.send(data[0]);
      })
      .catch(function (err) {
        res.status(500).send({ error: err.message });
      });
  } else {
    const data = await network.getNetworksData([nwid]);
    res.send(data[0]);
  }
});

// delete network
router.delete("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  network.deleteNetworkAdditionalData(nwid);
  api
    .delete("controller/network/" + nwid)
    .then(function (controllerRes) {
      res.status(controllerRes.status).send("");
    })
    .catch(function (err) {
      res.status(500).send({ error: err.message });
    });
});

module.exports = router;
