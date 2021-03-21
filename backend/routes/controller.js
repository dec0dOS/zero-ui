const express = require("express");
const router = express.Router();

const auth = require("../services/auth");
const api = require("../utils/controller-api");

router.get("/status", auth.isAuthorized, async function (req, res) {
  api.get("status").then(function (controllerRes) {
    res.send(controllerRes.data);
  });
});

module.exports = router;
