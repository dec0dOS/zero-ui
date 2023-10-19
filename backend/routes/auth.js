import express from "express";
import rateLimit from "express-rate-limit";

const router = express.Router();

import * as auth from "../services/auth.js";

const loginLimiter = rateLimit({
  windowMs: (Number(process.env.ZU_LOGIN_LIMIT_WINDOW) || 30) * 60 * 1000, // 30 minutes
  max: Number(process.env.ZU_LOGIN_LIMIT_ATTEMPTS) || 50, // limit each IP to 50 requests per windowMs
  message: {
    status: 429,
    error: "tooManyAttempts",
  },
});

const loginLimiterWrapper = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ZU_LOGIN_LIMIT === "true"
  ) {
    return loginLimiter(req, res, next);
  } else {
    return next();
  }
};

router.get("/login", async function (req, res) {
  if (process.env.ZU_DISABLE_AUTH === "true") {
    res.send({ enabled: false });
  } else {
    res.send({ enabled: true });
  }
});

router.post("/login", loginLimiterWrapper, async function (req, res) {
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

export default router;
