const path = require("path");
const fs = require("fs");

const db = require("../utils/db");
const cp = require("child_process");

//TODO: does this kind of "optimization" make sense in Node.js?
let token = null;
function getToken() {
  if (!token)
    try {
      token = db.get("users").value()[0].token;
    } catch {
      console.warn("*** token retrieval failed");
    }
  return token;
}

function setPid(nwid, pid) {
  db.get("networks")
    .filter({ id: nwid })
    .map("additionalConfig")
    .map((additionalConfig) => (additionalConfig.pidDNS = pid))
    .write();
}

const isRunning = (query, pid) => {
  return new Promise(function (resolve) {
    //FIXME: Check if pgrep is available
    cp.exec(`pgrep ${query}`, (err, stdout) => {
      resolve(stdout.indexOf(`${pid}`) > -1);
    });
  });
};

function startDNS(token, nwid, conf) {
  //FIXME: check it does the right thing when conf.pidDNS is null/undefined
  isRunning("zeronsd", conf.pidDNS).then((ok) => {
    if (ok) {
      console.log(
        `startDNS(${token}, ${nwid}): already active on PID ${conf.pidDNS}`
      );
    } else {
      let cmd = "zeronsd";
      let opts = Array();
      if (process.geteuid() === 0) {
        // production in Docker container
      } else {
        // we are debugging
        let myLocal = "/home/mcon/.cargo/bin";
        let pth = process.env.PATH.split(path.delimiter);
        if (!pth.includes(myLocal)) pth.push(myLocal);
        if (
          !process.env.PATH.split(path.delimiter).some(function (d) {
            let e = path.resolve(d, cmd);
            console.log(`*** PATH testing: "${d}" -> "${e}"`);
            try {
              fs.accessSync(e, fs.constants.X_OK);
              console.log("    is executable");
              cmd = "sudo";
              opts.push("-E", e);
              return true;
            } catch (e) {
              console.warn(`    cannot execute (${e})`);
              return false;
            }
          })
        ) {
          console.error(`*** zeronsd not found in PATH (${process.env.PATH})`);
          return;
        }
      }
      opts.push("start", "-v", "-v");
      if (conf.hasOwnProperty("dnsWildcard") && conf.dnsWildcard) {
        opts.push("-w");
      }
      if (conf.hasOwnProperty("dnsDomain") && !!conf.dnsDomain) {
        opts.push("-d", conf.dnsDomain);
      }
      opts.push(nwid);
      process.env.ZEROTIER_CENTRAL_TOKEN = token;
      console.log(`*** PATH: "${process.env.PATH}"`);
      console.log(
        `*** ZEROTIER_CENTRAL_TOKEN: "${process.env.ZEROTIER_CENTRAL_TOKEN}"`
      );
      let dns = cp.spawn(cmd, opts, { detached: true });
      dns.on("spawn", () => {
        console.log(
          `zeronsd successfully spawned [${dns.pid}](${dns.spawnargs})`
        );
        setPid(nwid, dns.pid);
      });
      dns.stdout.on("data", (data) => {
        console.log(`zeronsd spawn stdout: ${data}`);
      });
      dns.stderr.on("data", (data) => {
        console.error(`zeronsd spawn stderr: ${data}`);
      });
      dns.on("error", (error) => {
        console.log(`zeronsd spawn ERROR: [${error}](${dns.spawnargs})`);
      });
      dns.on("close", (code) => {
        console.log(`zeronsd exited: [${code}](${dns.spawnargs})`);
        setPid(nwid, null);
      });
    }
  });
}

function stopDNS(nwid, conf) {
  let pid = conf.pidDNS;
  if (pid) {
    isRunning("zeronsd", pid).then((ok) => {
      if (ok) {
        console.log(`stopDNS(${nwid}): stopping PID ${pid}`);
        try {
          process.kill(pid);
        } catch (e) {
          console.error(`stopDNS(${nwid}): stopping PID ${pid} FAILED (${e})`);
        }
      } else {
        console.log(`stopDNS(${nwid}): PID ${pid} is stale`);
      }
    });
    setPid(nwid, null);
  } else {
    console.log(`stopDNS(${nwid}): net has no PID`);
  }
}

exports.handleNet = handleNet;
function handleNet(net) {
  let cfg = net.additionalConfig;
  if (cfg.dnsEnable) {
    startDNS(getToken(), net.id, cfg);
  } else {
    stopDNS(net.id, cfg);
  }
}

exports.scan = scan;
function scan() {
  let nets = db.get("networks").value();
  nets.forEach((net) => {
    handleNet(net);
  });
}
