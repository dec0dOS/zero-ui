import express from "express";
const router = express.Router();

import { isAuthorized } from "../services/auth.js";
import { api } from "../utils/controller-api.js";

router.get("/status", isAuthorized, async function (req, res) {
  api.get("status").then(function (controllerRes) {
    res.send(controllerRes.data);
  });
});

export default router;
