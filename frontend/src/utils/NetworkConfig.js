export function generateNetworkConfig() {
  const randSubnetPart = getRandomInt(0, 254).toString();
  const randNamePart = new Date().getTime();
  return {
    config: {
      name: "new-net-" + randNamePart.toString().substring(8),
      private: true,
      v6AssignMode: { rfc4193: false, "6plane": false, zt: false },
      v4AssignMode: { zt: true },
      routes: [
        {
          target: "172.30." + randSubnetPart + ".0/24",
          via: null,
          flags: 0,
          metric: 0,
        },
      ],
      ipAssignmentPools: [
        {
          ipRangeStart: "172.30." + randSubnetPart + ".1",
          ipRangeEnd: "172.30." + randSubnetPart + ".254",
        },
      ],
      enableBroadcast: true,
    },
  };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const addressPool = [
  {
    name: "10.147.17.*",
    start: "10.147.17.1",
    end: "10.147.17.254",
  },
  {
    name: "10.147.18.*",
    start: "10.147.18.1",
    end: "10.147.18.254",
  },
  {
    name: "10.147.19.*",
    start: "10.147.19.1",
    end: "10.147.19.254",
  },
  {
    name: "10.147.20.*",
    start: "10.147.20.1",
    end: "10.147.20.254",
  },
  {
    name: "10.241.*.*",
    start: "10.241.0.1",
    end: "10.241.255.254",
  },
  {
    name: "10.242.*.*",
    start: "10.242.0.1",
    end: "10.242.255.254",
  },
  {
    name: "10.243.*.*",
    start: "10.243.0.1",
    end: "10.243.255.254",
  },
  {
    name: "10.244.*.*",
    start: "10.244.0.1",
    end: "10.244.255.254",
  },
  {
    name: "172.23.*.*",
    start: "172.23.0.1",
    end: "172.23.255.254",
  },
  {
    name: "172.24.*.*",
    start: "172.24.0.1",
    end: "172.24.255.254",
  },
  {
    name: "172.25.*.*",
    start: "172.25.0.1",
    end: "172.25.255.254",
  },
  {
    name: "172.26.*.*",
    start: "172.26.0.1",
    end: "172.26.255.254",
  },
  {
    name: "172.27.*.*",
    start: "172.27.0.1",
    end: "172.27.255.254",
  },
  {
    name: "172.28.*.*",
    start: "172.28.0.1",
    end: "172.28.255.254",
  },
  {
    name: "172.29.*.*",
    start: "172.29.0.1",
    end: "172.29.255.254",
  },
  {
    name: "172.30.*.*",
    start: "172.30.0.1",
    end: "172.30.255.254",
  },
  {
    name: "192.168.192.*",
    start: "192.168.192.1",
    end: "192.168.192.254",
  },
  {
    name: "192.168.193.*",
    start: "192.168.193.1",
    end: "192.168.193.254",
  },
  {
    name: "192.168.194.*",
    start: "192.168.194.1",
    end: "192.168.194.254",
  },
  {
    name: "192.168.195.*",
    start: "192.168.195.1",
    end: "192.168.195.254",
  },
];
