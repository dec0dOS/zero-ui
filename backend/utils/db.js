const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(process.env.ZU_DATAPATH || "data/db.json");

const db = low(adapter);

module.exports = db;
