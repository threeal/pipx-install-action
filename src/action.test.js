import { jest } from "@jest/globals";

let installedPkgs = [];
let savedPkgsCaches = [];

jest.unstable_mockModule("./pipx/index.mjs", () => ({
  default: {
    ensurePath: () => {},
    installPackage: async (pkg) => {
      switch (pkg) {
        case "black":
        case "ruff":
          installedPkgs.push(pkg);
          break;

        default:
          throw new Error("unknown package");
      }
    },
    restorePackageCache: async (pkg) => {
      if (savedPkgsCaches.includes(pkg)) {
        installedPkgs.push(pkg);
        return true;
      }
      return false;
    },
    savePackageCache: async (pkg) => {
      savedPkgsCaches.push(pkg);
    },
  },
}));

describe("install Python packages action", () => {
  beforeEach(() => {
    installedPkgs = [];
    savedPkgsCaches = ["flake8"];
  });

  it("should successfully install and save packages", async () => {
    const { pipxInstallAction } = await import("./action.mjs");

    const prom = pipxInstallAction("black", "ruff");
    await expect(prom).resolves.toBeUndefined();

    expect(installedPkgs).toContain("black");
    expect(savedPkgsCaches).toContain("black");

    expect(installedPkgs).toContain("ruff");
    expect(savedPkgsCaches).toContain("ruff");
  });

  it("should successfully restore a package", async () => {
    const { pipxInstallAction } = await import("./action.mjs");

    const prom = pipxInstallAction("flake8");
    await expect(prom).resolves.toBeUndefined();

    expect(installedPkgs).toContain("flake8");
  });
});
