export const testNetwork = {
  id: "0d303702cd0f1fc6",
  clock: 1672834445703,
  description: "Test Network",
  rulesSource:
    "\n# This is a default rule set that allows IPv4 and IPv6 traffic but otherwise\n# behaves like a standard Ethernet switch.\n\n#\n# Allow only IPv4, IPv4 ARP, and IPv6 Ethernet frames.\n#\ndrop\n  not ethertype ipv4\n  and not ethertype arp\n  and not ethertype ipv6\n;\n\n#\n# Uncomment to drop non-ZeroTier issued and managed IP addresses.\n#\n# This prevents IP spoofing but also blocks manual IP management at the OS level and\n# bridging unless special rules to exempt certain hosts or traffic are added before\n# this rule.\n#\n#drop\n#  not chr ipauth\n#;\n\n# Accept anything else. This is required since default is 'drop'.\naccept;\n",
  tagsByName: {},
  capabilitiesByName: {},
  config: {
    authTokens: [null],
    authorizationEndpoint: "",
    capabilities: [],
    clientId: "",
    creationTime: 1672676611179,
    dns: [],
    enableBroadcast: true,
    id: "0d303702cd0f1fc6",
    ipAssignmentPools: [
      {
        ipRangeEnd: "172.30.101.254",
        ipRangeStart: "172.30.101.1",
      },
    ],
    mtu: 2800,
    multicastLimit: 32,
    name: "new-net-11166",
    nwid: "0d303702cd0f1fc6",
    private: true,
    routes: [
      {
        target: "172.30.101.0/24",
        via: null,
      },
    ],
    rules: [
      {
        etherType: 2048,
        not: true,
        or: false,
        type: "MATCH_ETHERTYPE",
      },
      {
        etherType: 2054,
        not: true,
        or: false,
        type: "MATCH_ETHERTYPE",
      },
      {
        etherType: 34525,
        not: true,
        or: false,
        type: "MATCH_ETHERTYPE",
      },
      {
        type: "ACTION_DROP",
      },
      {
        type: "ACTION_ACCEPT",
      },
    ],
    ssoEnabled: false,
    tags: [],
    v4AssignMode: {
      zt: true,
    },
    v6AssignMode: {
      "6plane": false,
      rfc4193: false,
      zt: false,
    },
  },
};
