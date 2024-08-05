import type * as core from "@actions/core";
import { jest } from "@jest/globals";

let logs: (string | Error)[];
let failed: boolean;

jest.unstable_mockModule("@actions/core", () => ({
  endGroup: jest.fn<typeof core.endGroup>(() => {
    logs.push("::endgroup::");
  }),
  info: jest.fn<typeof core.info>((message) => {
    logs.push(message);
  }),
  setFailed: jest.fn<typeof core.setFailed>((message) => {
    failed = true;
    logs.push(message);
  }),
  startGroup: jest.fn<typeof core.startGroup>((name) => {
    logs.push(`::group::${name}`);
  }),
}));

jest.unstable_mockModule("./pipx/index.js", () => ({
  default: {
    ensurePath: jest.fn(),
    installPackage: jest.fn(),
    restorePackageCache: jest.fn(),
    savePackageCache: jest.fn(),
  },
}));

describe("install Python packages action", () => {
  beforeEach(async () => {
    const pipx = (await import("./pipx/index.js")).default;

    logs = [];
    failed = false;

    jest.mocked(pipx.ensurePath).mockImplementation(() => {
      logs.push("path ensured");
    });

    jest.mocked(pipx.installPackage).mockImplementation(async (pkg) => {
      logs.push(`${pkg} installed`);
    });

    jest.mocked(pipx.restorePackageCache).mockImplementation(async (pkg) => {
      logs.push(`${pkg} cache not found`);
      return false;
    });

    jest.mocked(pipx.savePackageCache).mockImplementation(async (pkg) => {
      logs.push(`${pkg} cache saved`);
    });
  });

  it("should successfully install package and save cache", async () => {
    const { pipxInstallAction } = await import("./action.js");

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(false);
    expect(logs).toStrictEqual([
      "Ensuring pipx path...",
      "path ensured",
      "::group::Restoring \u001b[34many-pkg\u001b[39m cache...",
      "any-pkg cache not found",
      "::endgroup::",
      "::group::Cache not found, installing \u001b[34many-pkg\u001b[39m...",
      "any-pkg installed",
      "::endgroup::",
      "::group::Saving \u001b[34many-pkg\u001b[39m cache...",
      "any-pkg cache saved",
      "::endgroup::",
    ]);
  });

  it("should failed to ensure pipx path", async () => {
    const { ensurePath } = (await import("./pipx/index.js")).default;
    const { pipxInstallAction } = await import("./action.js");

    jest.mocked(ensurePath).mockImplementation(() => {
      throw new Error("something happened");
    });

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(true);
    expect(logs.slice(-2)).toStrictEqual([
      "Ensuring pipx path...",
      "Failed to ensure pipx path: something happened",
    ]);
  });

  it("should failed to restore package cache", async () => {
    const { restorePackageCache } = (await import("./pipx/index.js")).default;
    const { pipxInstallAction } = await import("./action.js");

    jest
      .mocked(restorePackageCache)
      .mockRejectedValue(new Error("something happened"));

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(true);
    expect(logs.slice(-3)).toStrictEqual([
      "::group::Restoring \u001b[34many-pkg\u001b[39m cache...",
      "::endgroup::",
      "Failed to restore any-pkg cache: something happened",
    ]);
  });

  it("should failed to install package", async () => {
    const { installPackage } = (await import("./pipx/index.js")).default;
    const { pipxInstallAction } = await import("./action.js");

    jest
      .mocked(installPackage)
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
    const { savePackageCache } = (await import("./pipx/index.js")).default;
    const { pipxInstallAction } = await import("./action.js");

    jest
      .mocked(savePackageCache)
      .mockRejectedValue(new Error("something happened"));

    await expect(pipxInstallAction("any-pkg")).resolves.toBeUndefined();

    expect(failed).toBe(true);
    expect(logs.slice(-3)).toStrictEqual([
      "::group::Saving \u001b[34many-pkg\u001b[39m cache...",
      "::endgroup::",
      "Failed to save any-pkg cache: something happened",
    ]);
  });
});
