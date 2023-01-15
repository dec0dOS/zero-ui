import * as IP from "utils/IP";

describe("IP", () => {
  describe("getCIDRAddress()", () => {
    test("throws and error if start parameter is not a valid IPv4", () => {
      expect(() => {
        IP.getCIDRAddress(1, "1.1.1.1");
      }).toThrow("ipaddr: the address has neither IPv6 nor IPv4 format");
    });

    test("throws and error if end parameter is not a valid IPv4", () => {
      expect(() => {
        IP.getCIDRAddress("1.1.1.1", 1);
      }).toThrow("ipaddr: the address has neither IPv6 nor IPv4 format");
    });

    test("returns /32 if both IPv4 addresses are the same", () => {
      expect(IP.getCIDRAddress("1.1.1.1", "1.1.1.1")).toBe("1.1.1.0/32");
    });

    test("returns different values depending on how many bits are different between start and end IPv4 addresses", () => {
      expect(IP.getCIDRAddress("1.1.1.1", "1.1.1.0")).toBe("1.1.1.0/31");
      expect(IP.getCIDRAddress("1.1.1.1", "1.1.1.2")).toBe("1.1.1.0/30");
      expect(IP.getCIDRAddress("1.1.1.1", "1.1.1.4")).toBe("1.1.1.0/29");
      expect(IP.getCIDRAddress("1.1.1.1", "1.1.1.8")).toBe("1.1.1.0/28");
      expect(IP.getCIDRAddress("1.1.1.1", "1.1.2.1")).toBe("1.1.1.0/22");
    });

    test("returns '<start with last character changed to 0>/32' no matter what valid IPv6 addresses are provided for start and end", () => {
      expect(IP.getCIDRAddress("2001:db8:1234::1", "2001:db8:1234::1")).toBe(
        "2001:db8:1234::0/32"
      );
      expect(IP.getCIDRAddress("2001:db8:1234::32", "2001:db8:1234::1")).toBe(
        "2001:db8:1234::30/32"
      );
      expect(IP.getCIDRAddress("2001:db8:1234::3000", "2001:db8:1234::1")).toBe(
        "2001:db8:1234::3000/32"
      );
      expect(IP.getCIDRAddress("2002:db8:1234::1", "2001:db8:1234::1")).toBe(
        "2002:db8:1234::0/32"
      );
    });
  });

  describe("getCIDR()", () => {
    test("throws and error if start parameter is not a valid IPv4", () => {
      expect(() => {
        IP.getCIDR(1, "1.1.1.1");
      }).toThrow("ipaddr: the address has neither IPv6 nor IPv4 format");
    });

    test("throws and error if end parameter is not a valid IPv4", () => {
      expect(() => {
        IP.getCIDR("1.1.1.1", 1);
      }).toThrow("ipaddr: the address has neither IPv6 nor IPv4 format");
    });

    test("returns 32 if both IPv4 addresses are the same", () => {
      expect(IP.getCIDR("1.1.1.1", "1.1.1.1")).toBe(32);
    });

    test("returns different values depending on how many bits are different between start and end IPv4 addresses", () => {
      expect(IP.getCIDR("1.1.1.1", "1.1.1.0")).toBe(31);
      expect(IP.getCIDR("1.1.1.1", "1.1.1.2")).toBe(30);
      expect(IP.getCIDR("1.1.1.1", "1.1.1.4")).toBe(29);
      expect(IP.getCIDR("1.1.1.1", "1.1.1.8")).toBe(28);
    });

    test("returns 32 no matter what valid IPv6 addresses are provided for start and end", () => {
      expect(IP.getCIDR("2001:db8:1234::1", "2001:db8:1234::1")).toBe(32);
      expect(IP.getCIDR("2001:db8:1234::1", "2001:db8:1234::0")).toBe(32);
      expect(IP.getCIDR("2001:db8:1234::1", "2001:db8:1234::2")).toBe(32);
      expect(IP.getCIDR("2001:db8:1234::1", "2001:db8:1235::1")).toBe(32);
      expect(IP.getCIDR("2002:db8:1234::1", "2001:db8:1234::1")).toBe(32);
    });
  });

  describe("toInt()", () => {
    test("returns an IP in integer format when given a valid IPv4", () => {
      expect(IP.toInt("1.1.1.1")).toBe(16843009);
    });

    test("throw an error if a string that is not an IP is provided as input", () => {
      expect(() => {
        IP.toInt("some string that is not an IPv4 or IPv6");
      }).toThrow("ipaddr: the address has neither IPv6 nor IPv4 format");
    });

    test("throw an error if addr is undefined", () => {
      expect(IP.toInt).toThrow(
        "ipaddr: the address has neither IPv6 nor IPv4 format"
      );
    });

    test("returns 0 when given a valid IPv6", () => {
      expect(IP.toInt("2001:db8:1234::1")).toBe(0);
    });
  });

  describe("validateIP()", () => {
    test("returns true if the provided string is a valid IPv4 address", () => {
      expect(IP.validateIP("1.1.1.1")).toBe(true);
    });

    test("returns true if the provided string is a valid IPv6 address", () => {
      expect(IP.validateIP("2001:db8:1234::1")).toBe(true);
    });

    test("returns false if the provided string is not a valid IPv4 or IPv6 address", () => {
      expect(
        IP.validateIP("some string that is not an IPv4 or IPv6 address")
      ).toBe(false);
    });
  });

  describe("normilizeIP()", () => {
    test("returns an IPv4 address with no leading 0's for each octet", () => {
      expect(IP.normilizeIP("01.01.01.01")).toBe("1.1.1.1");
    });

    test("returns an IPv6 address with explicit 0's octets (if any) and no leading 0's (if any)", () => {
      expect(IP.normilizeIP("2001:0db8:1234::0001")).toBe(
        "2001:db8:1234:0:0:0:0:1"
      );
    });

    test("throw an error if a string that is not an IP is provided as input", () => {
      expect(() => {
        IP.normilizeIP("some string that is not an IPv4 or IPv6");
      }).toThrow("ipaddr: the address has neither IPv6 nor IPv4 format");
    });
  });

  describe("validateCIDR()", () => {
    test("returns true if provided a valid IPv4 CIDR address", () => {
      expect(IP.validateCIDR("1.1.1.0/24")).toBe(true);
    });

    test("returns true if provided a valid IPv6 CIDR address", () => {
      expect(IP.validateCIDR("2001:0db8:1234::/64")).toBe(true);
    });

    test("throw an error if a string that is not an IPv4 or IPv6 CIDR is provided as input", () => {
      expect(
        IP.validateCIDR("some string that is not an IPv4 or IPv6 CIDR address")
      ).toBe(false);
    });
  });
});
