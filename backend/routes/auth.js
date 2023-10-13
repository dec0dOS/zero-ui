import express from "express";
import rateLimit from "express-rate-limit"
const router = express.Router();

import * as auth from "../services/auth.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again in 15 minutes.",
});

router.get("/login", async function (req, res) {
  if (process.env.ZU_DISABLE_AUTH === "true") {
    res.send({ enabled: false });
  } else {
    res.send({ enabled: true });
  }
});

router.post("/login", loginLimiter, async function (req, res) {
  if (req.body.username && req.body.password) {
    auth.authorize(req.body.username, req.body.password, function (err, user) {
      console.log(err.message)
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

export default router;
