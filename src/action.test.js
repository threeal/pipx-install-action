import { jest } from "@jest/globals";

let installedPkgs = [];

jest.unstable_mockModule("./pipx/install.mjs", () => ({
  installPackage: async (pkg) => {
    installedPkgs.push(pkg);
  },
}));

describe("install Python packages action", () => {
  beforeEach(() => {
    installedPkgs = [];
  });

  it("should successfully install packages", async () => {
    const { pipxInstallAction } = await import("./action.mjs");

    const prom = pipxInstallAction("black", "ruff");
    await expect(prom).resolves.toBeUndefined();

    expect(installedPkgs).toContain("black");
    expect(installedPkgs).toContain("ruff");
  });
});
