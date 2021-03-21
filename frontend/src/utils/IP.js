import ipaddr from "ipaddr.js";

export function getCIDRAddress(start, end) {
  const cidr = getCIDR(start, end);
  return start.replace(/.$/, 0) + "/" + cidr;
}

function getCIDR(start, end) {
  const startInt = toInt(start);
  const endInt = toInt(end);
  const binaryXOR = startInt ^ endInt;
  if (binaryXOR === 0) {
    return 32;
  } else {
    const binaryStr = binaryXOR.toString(2);
    const zeroCount = binaryStr.split("0").length - 1;
    const oneCount = binaryStr.split("1").length - 1;
    return 32 - (zeroCount + oneCount);
  }
}

function toInt(addr) {
  const ip = ipaddr.parse(addr);
  const arr = ip.octets;
  let ipInt = 0;
  let counter = 3;
  for (const i in arr) {
    ipInt += arr[i] * Math.pow(256, counter);
    counter--;
  }
  return ipInt;
}

export function validateIP(string) {
  return ipaddr.IPv4.isValid(string) || ipaddr.IPv6.isValid(string);
}

export function normilizeIP(string) {
  const addr = ipaddr.parse(string);
  return addr.toNormalizedString();
}

export function validateCIDR(string) {
  try {
    ipaddr.parseCIDR(string);
    return true;
  } catch (err) {
    return false;
  }
}
