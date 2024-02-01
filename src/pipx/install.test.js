import { jest } from "@jest/globals";

let installedPkgs = [];

jest.unstable_mockModule("@actions/exec", () => ({
  exec: async (commandLine, args) => {
    expect(commandLine).toBe("pipx");
    expect(args.length).toBe(2);
    expect(args[0]).toBe("install");

    switch (args[1]) {
      case "black":
      case "ruff":
        installedPkgs.push(args[1]);
        break;

      default:
        throw new Error(`unknown package ${args[1]}`);
    }
  },
}));

describe("install Python packages", () => {
  beforeEach(() => {
    installedPkgs = [];
  });

  it("should successfully install packages", async () => {
    const { pipxInstall } = await import("./install.mjs");

    const prom = pipxInstall("black", "ruff");
    await expect(prom).resolves.toBeUndefined();

    expect(installedPkgs).toContain("black");
    expect(installedPkgs).toContain("ruff");
  });

  it("should fail to install an invalid package", async () => {
    const { pipxInstall } = await import("./install.mjs");

    const prom = pipxInstall("invalid-pkg");
    await expect(prom).rejects.toThrow("Failed to install invalid-pkg");
  });
});
