const express = require("express");
const path = require("path");
const logger = require("morgan");
const compression = require("compression");
const bearerToken = require("express-bearer-token");
const helmet = require("helmet");

const db = require("./utils/db");
const initAdmin = require("./utils/init-admin");

const authRoutes = require("./routes/auth");
const networkRoutes = require("./routes/network");
const memberRoutes = require("./routes/member");
const controllerRoutes = require("./routes/controller");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  bearerToken({
    headerKey: "Bearer",
  })
);

if (
  process.env.NODE_ENV === "production" &&
  process.env.ZU_SECURE_HEADERS !== "false"
) {
  app.use(helmet());
}

if (
  process.env.NODE_ENV === "production" &&
  process.env.ZU_SERVE_FRONTEND !== "false"
) {
  app.use(compression());
  app.use(
    ["/app", "/app/*"],
    express.static(path.join(__dirname, "..", "frontend", "build"))
  );
  app.get(["/app/network/*"], function (req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });
  app.get("/", function (req, res) {
    res.redirect("/app");
  });
}

initAdmin().then(function (admin) {
  db.defaults({ users: [admin], networks: [] }).write();
});

const routerAPI = express.Router();
const routerController = express.Router();

routerAPI.use("/network", networkRoutes);
routerAPI.use("/network/:nwid/member", memberRoutes);
routerController.use("", controllerRoutes);

app.use("/auth", authRoutes);
app.use("/api", routerAPI); // offical SaaS API compatible
app.use("/controller", routerController); // other controller-specific routes

// error handlers
app.get("*", async function (req, res) {
  res.status(404).json({ error: "404 Not found" });
});
app.use(async function (err, req, res) {
  console.error(err.stack); // TODO: replace with production logger
  res.status(500).json({ error: "500 Internal server error" });
});

module.exports = app;
