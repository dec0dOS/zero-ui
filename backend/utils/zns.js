const { spawn } = require("child_process");

function pidIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

function startDNS(token, nwid, conf) {
  if (conf.hasOwnProperty("pidDNS")) {
    if (pidIsRunning(conf.pidDNS)) {
      return null;
    }
    delete conf.pidDNS;
  }
  const opts = Array("start");
  if (conf.hasOwnProperty("dnsWildcard") && conf.dnsWildcard) {
    opts.push("-w");
  }
  if (conf.hasOwnProperty("dnsDomain") && !!conf.dnsDomain) {
    opts.push("-d", conf.dnsDomain);
  }
  opts.push(nwid);
  let env = process.env;
  env.ZEROTIER_CENTRAL_TOKEN = token;
  console.log(`*** PATH: "${env.PATH}"`);
  const dns = spawn("zeronsd", opts, {
    detached: true,
    env: env,
  });
  dns.on("spawn", () => {
    console.log(`zeronsd successfully spawned [${dns.pid}](${dns.spawnargs})`);
    console.log("*** should update PID ***");
  });
  dns.on("error", (error) => {
    console.log(`zeronsd spawn ERROR: [${error}](${dns.spawnargs})`);
  });
  conf.pidDNS = dns.pid;
  return conf;
}

function stopDNS(conf) {
  if (conf.hasOwnProperty("pidDNS")) {
    try {
      process.kill(conf.pidDNS);
    } catch (e) {}
    delete conf.pidDNS;
    return conf;
  }
  return null;
}

module.exports = function (token, nwid, conf) {
  let ret;
  if (conf.dnsEnable) {
    ret = startDNS(token, nwid, conf);
  } else {
    ret = stopDNS(conf);
  }
  return ret;
};
