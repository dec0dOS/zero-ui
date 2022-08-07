const express = require("express");
const path = require("path");
const router = express.Router();

const auth = require("../services/auth");

router.get("/:downfilename", async function (req, res) {
  const ret = await auth.isUserLoggedIn(req);
  if (ret) {
    const filename = req.params.downfilename;
    res.sendFile(
      path.join(__dirname, "..", "..", "frontend", "down_folder", filename)
    );
  } else {
    res
      .status(401)
      .json({ error: "401 Not authorized, must Login to download" });
  }
});

module.exports = router;
