exports.defaultRulesSource = `
# This is a default rule set that allows IPv4 and IPv6 traffic but otherwise
# behaves like a standard Ethernet switch.

#
# Allow only IPv4, IPv4 ARP, and IPv6 Ethernet frames.
#
drop
  not ethertype ipv4
  and not ethertype arp
  and not ethertype ipv6
;

#
# Uncomment to drop non-ZeroTier issued and managed IP addresses.
#
# This prevents IP spoofing but also blocks manual IP management at the OS level and
# bridging unless special rules to exempt certain hosts or traffic are added before
# this rule.
#
#drop
#  not chr ipauth
#;

# Accept anything else. This is required since default is 'drop'.
accept;
`;

exports.defaultRules = `
[
  {
   "type": "MATCH_ETHERTYPE",
   "not": true,
   "or": false,
   "etherType": 2048
  },
  {
   "type": "MATCH_ETHERTYPE",
   "not": true,
   "or": false,
   "etherType": 2054
  },
  {
   "type": "MATCH_ETHERTYPE",
   "not": true,
   "or": false,
   "etherType": 34525
  },
  {
   "type": "ACTION_DROP"
  },
  {
   "type": "ACTION_ACCEPT"
  }
 ]
`;
