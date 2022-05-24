const db = require("../utils/db");
const verifyHash = require("pbkdf2-wrapper/verifyHash");

exports.authorize = authorize;
async function authorize(username, password, callback) {
  try {
    var users = await db.get("users");
  } catch (err) {
    throw err;
  }
  const user = users.find({ username: username });
  if (!user.value()) return callback(new Error("Cannot find user"));
  const verified = await verifyHash(password, user.value()["password_hash"]);
  if (verified) {
    return callback(null, user.value());
  } else {
    return callback(new Error("Invalid password"));
  }
}

exports.isAuthorized = isAuthorized;
async function isAuthorized(req, res, next) {
  if (process.env.ZU_DISABLE_AUTH === "true") {
    next();
  } else {
    if (req.token) {
      const user = await db.get("users").find({ token: req.token }).value();
      if (user) {
        next();
      } else {
        res.status(403).send({ error: "Invalid token" });
      }
    } else {
      res.status(401).send({ error: "Specify token" });
    }
  }
}
