const api = require("./controller-api");
const db = require("./db");

export default pingAll;
async function pingAll (network) {
    await Promise.all(network.members.map((async (member) => {
        try {
            await api.get("peer/" + member.id);
            // write lastOnelineTime field in db
            db.get("networks")
                .filter({ id: network.id })
                .map("members")
                .first()
                .filter({ id: member.id })
                .first()
                .set("lastOnlineTime", new Date().getTime())
                .write();
        } catch (err) {
            return;
        }
    })));
};
