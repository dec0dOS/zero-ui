import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

const adapter = new FileSync(process.env.ZU_DATAPATH || "data/db.json");

export const db = low(adapter);
