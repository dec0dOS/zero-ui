const express = require("express");
const router = express.Router();

const auth = require("../services/auth");

router.get("/login", async function (req, res) {
  if (process.env.ZU_DISABLE_AUTH === "true") {
    res.send({ enabled: false });
  } else {
    res.send({ enabled: true });
  }
});

router.post("/login", async function (req, res) {
  if (req.body.username && req.body.password) {
    auth.authorize(req.body.username, req.body.password, function (err, user) {
      if (user) {
        res.send({ token: user["token"] });
      } else {
        res.status(401).send({
          error: err.message,
        });
      }
    });
  } else {
    res.status(400).send({ error: "Specify username and password" });
  }
});

module.exports = router;
