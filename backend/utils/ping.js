const api = require("./controller-api");
const db = require("./db");

async function pingAll(network) {
  await Promise.all(
    network.members.map(async (member) => {
      console.debug("Processing " + member.id);
      api
        .get("peer/" + member.id)
        .then(async function () {
          // write lastOneline field in db
          db.get("networks")
            .filter({ id: network.id })
            .map("members")
            .first()
            .filter({ id: member.id })
            .first()
            .set("lastOnline", new Date().getTime())
            .write();
        })
        .catch(function (err) {
          console.debug("Couldn't fetch", member.id);
          return;
        });
    })
  );
}

module.exports = pingAll;
