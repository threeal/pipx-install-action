import { jest } from "@jest/globals";
import type { beginLogGroup, endLogGroup, logError, logInfo } from "gha-utils";

let logs: unknown[];
let failed: boolean;

jest.unstable_mockModule("gha-utils", () => ({
  beginLogGroup: jest.fn<typeof beginLogGroup>((name) => {
    logs.push(`::group::${name}`);
  }),
  endLogGroup: jest.fn<typeof endLogGroup>(() => {
    logs.push("::endgroup::");
  }),
  logError: jest.fn<typeof logError>((message) => {
    failed = true;
    logs.push(message);
  }),
  logInfo: jest.fn<typeof logInfo>((message) => {
    logs.push(message);
  }),
}));

jest.unstable_mockModule("./pipx/index.js", () => ({
  default: {
    addPipxPackagePath: jest.fn(),
    installPipxPackage: jest.fn(),
    restorePipxPackageCache: jest.fn(),
    savePipxPackageCache: jest.fn(),
  },
}));

describe("install Python packages action", () => {
  beforeEach(async () => {
    const pipx = (await import("./pipx/index.js")).default;

    logs = [];
    failed = false;

    jest.mocked(pipx.addPipxPackagePath).mockImplementation(async (pkg) => {
      logs.push(`${pkg} path added`);
    });

    jest.mocked(pipx.installPipxPackage).mockImplementation(async (pkg) => {
      logs.push(`${pkg} installed`);
    });

    jest
      .mocked(pipx.restorePipxPackageCache)
      .mockImplementation(async (pkg) => {
        logs.push(`${pkg} cache not found`);
        return false;
      });

    jest.mocked(pipx.savePipxPackageCache).mockImplementation(async (pkg) => {
      logs.push(`${pkg} cache saved`);
    });
  });

  it("should successfully restore cache", async () => {
    const { restorePipxPackageCache } = (await import("./pipx/index.js"))
      .default;
    const { pipxInstallAction } = await import("./lib.js");

    jest.mocked(restorePipxPackageCache).mockImplementation(async (pkg) => {
      logs.push(`${pkg} cache found`);
      return true;
    });

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(false);
    expect(logs).toStrictEqual([
      "Restoring \u001b[34many-pkg\u001b[39m cache...",
      "any-pkg cache found",
      "any-pkg path added",
    ]);
  });

  it("should successfully install package and save cache", async () => {
    const { pipxInstallAction } = await import("./lib.js");

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(false);
    expect(logs).toStrictEqual([
      "Restoring \u001b[34many-pkg\u001b[39m cache...",
      "any-pkg cache not found",
      "::group::Cache not found, installing \u001b[34many-pkg\u001b[39m...",
      "any-pkg installed",
      "any-pkg path added",
      "::endgroup::",
      "Saving \u001b[34many-pkg\u001b[39m cache...",
      "any-pkg cache saved",
    ]);
  });

  it("should failed to restore package cache", async () => {
    const { restorePipxPackageCache } = (await import("./pipx/index.js"))
      .default;
    const { pipxInstallAction } = await import("./lib.js");

    jest
      .mocked(restorePipxPackageCache)
      .mockRejectedValue(new Error("something happened"));

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(true);
    expect(logs.slice(-2)).toStrictEqual([
      "Restoring \u001b[34many-pkg\u001b[39m cache...",
      "Failed to restore any-pkg cache: something happened",
    ]);
  });

  it("should failed to install package", async () => {
    const { installPipxPackage } = (await import("./pipx/index.js")).default;
    const { pipxInstallAction } = await import("./lib.js");

    jest
      .mocked(installPipxPackage)
      .mockRejectedValue(new Error("something happened"));

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(true);
    expect(logs.slice(-3)).toStrictEqual([
      "::group::Cache not found, installing \u001b[34many-pkg\u001b[39m...",
      "::endgroup::",
      "Failed to install any-pkg: something happened",
    ]);
  });

  it("should failed to save package cache", async () => {
    const { savePipxPackageCache } = (await import("./pipx/index.js")).default;
    const { pipxInstallAction } = await import("./lib.js");

    jest
      .mocked(savePipxPackageCache)
      .mockRejectedValue(new Error("something happened"));

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(true);
    expect(logs.slice(-2)).toStrictEqual([
      "Saving \u001b[34many-pkg\u001b[39m cache...",
      "Failed to save any-pkg cache: something happened",
    ]);
  });
});
