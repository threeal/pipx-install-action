import { jest } from "@jest/globals";

jest.unstable_mockModule("@actions/exec", () => ({
  getExecOutput: async (commandLine, args) => {
    expect(commandLine).toBe("pipx");
    expect(args.length).toBe(3);
    expect(args[0]).toBe("environment");
    expect(args[1]).toBe("--value");

    switch (args[2]) {
      case "PIPX_LOCAL_VENVS":
        return { stdout: "/path/to/venvs" };

      default:
        throw new Error("unknown environment");
    }
  },
}));

describe("get pipx environments", () => {
  it("should successfully get an environment", async () => {
    const { getEnvironment } = await import("./environment.mjs");

    const prom = getEnvironment("PIPX_LOCAL_VENVS");
    await expect(prom).resolves.toBe("/path/to/venvs");
  });

  it("should fail to get an invalid environment", async () => {
    const { getEnvironment } = await import("./environment.mjs");

    const prom = getEnvironment("INVALID_ENV");
    await expect(prom).rejects.toThrow("Failed to get INVALID_ENV");
  });
});
