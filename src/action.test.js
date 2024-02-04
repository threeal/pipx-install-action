import { jest } from "@jest/globals";

let installedPkgs = [];
let savedPkgsCaches = [];

jest.unstable_mockModule("./pipx/index.mjs", () => ({
  default: {
    installPackage: async (pkg) => {
      installedPkgs.push(pkg);
    },
    savePackageCache: async (pkg) => {
      savedPkgsCaches.push(pkg);
    },
  },
}));

describe("install Python packages action", () => {
  beforeEach(() => {
    installedPkgs = [];
    savedPkgsCaches = [];
  });

  it("should successfully install packages", async () => {
    const { pipxInstallAction } = await import("./action.mjs");

    const prom = pipxInstallAction("black", "ruff");
    await expect(prom).resolves.toBeUndefined();

    expect(installedPkgs).toContain("black");
    expect(savedPkgsCaches).toContain("black");

    expect(installedPkgs).toContain("ruff");
    expect(savedPkgsCaches).toContain("ruff");
  });
});
