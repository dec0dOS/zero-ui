import express from "express";
const router = express.Router();

import * as auth from "../services/auth.js";
import { api } from "../utils/controller-api.js";

router.get("/status", auth.isAuthorized, async function (req, res) {
  api.get("status").then(function (controllerRes) {
    res.send(controllerRes.data);
  });
});

export default router;
