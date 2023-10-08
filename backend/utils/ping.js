import _ from "lodash";

import { api } from "./controller-api.js";
import { db } from "./db.js";

export async function pingAll(network) {
  await Promise.all(
    network.members.map(async (member) => {
      console.debug("Processing member " + member.id);
      api
        .get("peer/" + member.id)
        .then(function (controllerResp) {
          if (!_.isEmpty(controllerResp.data)) {
            // write lastOnline field in db
            db.get("networks")
              .filter({ id: network.id })
              .map("members")
              .first()
              .filter({ id: member.id })
              .first()
              .set("lastOnline", new Date().getTime())
              .write();
          }
        })
        .catch(function (err) {
          console.debug("Couldn't fetch", member.id);
          return;
        });
    })
  );
}
