import * as NetworkConfig from "utils/NetworkConfig";

jest.spyOn(Math, "random").mockReturnValue(0.5);
jest.spyOn(Date, "now").mockImplementation(() => 1487076708000);

describe("NetworkConfig", () => {
  it("getRandomInt()", () => {
    expect(NetworkConfig.getRandomInt(1, 10)).toBe(5);
    expect(NetworkConfig.getRandomInt(2, 2)).toBe(2);
    expect(NetworkConfig.getRandomInt("test", 10)).toBe(NaN);
    expect(NetworkConfig.getRandomInt(1, "test")).toBe(NaN);
    expect(NetworkConfig.getRandomInt("test", "test")).toBe(NaN);
  });

  it("generateNetworkConfig()", () => {
    expect(NetworkConfig.generateNetworkConfig()).toStrictEqual({
      config: {
        name: "new-net-08000",
        private: true,
        v6AssignMode: { "6plane": false, rfc4193: false, zt: false },
        v4AssignMode: { zt: true },
        routes: [{ flags: 0, metric: 0, target: "172.30.127.0/24", via: null }],
        ipAssignmentPools: [
          { ipRangeEnd: "172.30.127.254", ipRangeStart: "172.30.127.1" },
        ],
        enableBroadcast: true,
      },
    });
  });
});
