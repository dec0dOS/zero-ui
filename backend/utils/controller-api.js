const axios = require("axios");
const fs = require("fs");

const baseURL = process.env.ZU_CONTROLLER_ENDPOINT || "http://localhost:9993/";

var token;
if (process.env.ZU_CONTROLLER_TOKEN) {
  token = process.env.ZU_CONTROLLER_TOKEN;
} else {
  if (process.platform === "unix") {
    token = fs.readFileSync("/var/lib/zerotier-one/authtoken.secret", "utf8");
  } else if (process.platform === "win32") {
    token = fs.readFileSync(
      "C:\\ProgramData\\ZeroTier\\One\\authtoken.secret",
      "utf8"
    );
  } else if (process.platform === "darwin") {
    token = fs.readFileSync(
      "/Library/Application Support/ZeroTier/One/authtoken.secret",
      "utf8"
    );
  } else {
    throw `Unsupported platform ${process.platform}`;
  }
}

module.exports = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    "X-ZT1-Auth": token,
  },
});
