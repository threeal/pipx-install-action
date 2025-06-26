import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  installPipxPackage,
  restorePipxPackageCache,
  savePipxPackageCache,
} from "./lib.js";

import {
  beginLogGroup,
  endLogGroup,
  getInput,
  logError,
  logInfo,
} from "gha-utils";

describe("install Python packages", () => {
  let logs: string[] = [];
  let inputs: Record<string, string | undefined> = {};

  vi.mock("gha-utils", () => ({
    beginLogGroup: vi.fn(),
    endLogGroup: vi.fn(),
    getInput: vi.fn(),
    logError: vi.fn(),
    logInfo: vi.fn(),
  }));

  vi.mocked(beginLogGroup).mockImplementation((name) => {
    logs.push(`::group::${name}`);
  });

  vi.mocked(endLogGroup).mockImplementation(() => {
    logs.push("::endgroup::");
  });

  vi.mocked(getInput).mockImplementation((name) => {
    return inputs[name] ?? "";
  });

  vi.mocked(logError).mockImplementation((err) => {
    logs.push(`::error::${(err as Error).message}`);
  });

  vi.mocked(logInfo).mockImplementation((message) => {
    logs.push(message);
  });

  let cachedPackages: string[] = [];
  let installedPackages: string[] = [];

  vi.mock("./lib.js", () => ({
    installPipxPackage: vi.fn(),
    restorePipxPackageCache: vi.fn(),
    savePipxPackageCache: vi.fn(),
  }));

  beforeEach(() => {
    vi.resetModules();

    logs = [];
    inputs = {};

    cachedPackages = [];
    installedPackages = [];

    vi.mocked(installPipxPackage).mockImplementation((pkg) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          installedPackages.push(pkg);
          resolve();
        }, 100);
      });
    });

    vi.mocked(restorePipxPackageCache).mockImplementation((pkg) => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          if (cachedPackages.includes(pkg)) {
            installedPackages.push(pkg);
            resolve(true);
          } else {
            resolve(false);
          }
        }, 100);
      });
    });

    vi.mocked(savePipxPackageCache).mockImplementation((pkg) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          cachedPackages.push(pkg);
          resolve();
        }, 100);
      });
    });

    process.exitCode = undefined;
  });

  it("should fail to restore a package cache", async () => {
    inputs.packages = "a-package";

    vi.mocked(restorePipxPackageCache).mockRejectedValue(
      new Error("unknown error"),
    );

    await import("../src/main.js");

    expect(logs).toEqual([
      "Restoring \u001b[34ma-package\u001b[39m cache...",
      "::error::Failed to restore a-package cache: unknown error",
    ]);
    expect(process.exitCode).toBe(1);

    expect(cachedPackages).toEqual([]);
    expect(installedPackages).toEqual([]);
  });

  it("should fail to install a package", async () => {
    inputs.packages = "a-package";

    vi.mocked(installPipxPackage).mockRejectedValue(new Error("unknown error"));

    await import("../src/main.js");

    expect(logs).toEqual([
      "Restoring \u001b[34ma-package\u001b[39m cache...",
      "::group::Cache not found, installing \u001b[34ma-package\u001b[39m...",
      "::endgroup::",
      "::error::Failed to install a-package: unknown error",
    ]);
    expect(process.exitCode).toBe(1);

    expect(cachedPackages).toEqual([]);
    expect(installedPackages).toEqual([]);
  });

  it("should fail to save a package cache", async () => {
    inputs.packages = "a-package";

    vi.mocked(savePipxPackageCache).mockRejectedValue(
      new Error("unknown error"),
    );

    await import("../src/main.js");

    expect(logs).toEqual([
      "Restoring \u001b[34ma-package\u001b[39m cache...",
      "::group::Cache not found, installing \u001b[34ma-package\u001b[39m...",
      "::endgroup::",
      "Saving \u001b[34ma-package\u001b[39m cache...",
      "::error::Failed to save a-package cache: unknown error",
    ]);
    expect(process.exitCode).toBe(1);

    expect(cachedPackages).toEqual([]);
    expect(installedPackages).toEqual(["a-package"]);
  });

  it("should install packages and save the cache", async () => {
    inputs.packages = "a-package another-package";

    await import("../src/main.js");

    expect(logs).toEqual([
      "Restoring \u001b[34ma-package\u001b[39m cache...",
      "::group::Cache not found, installing \u001b[34ma-package\u001b[39m...",
      "::endgroup::",
      "Saving \u001b[34ma-package\u001b[39m cache...",
      "Restoring \u001b[34manother-package\u001b[39m cache...",
      "::group::Cache not found, installing \u001b[34manother-package\u001b[39m...",
      "::endgroup::",
      "Saving \u001b[34manother-package\u001b[39m cache...",
    ]);
    expect(process.exitCode).toBeUndefined();

    expect(cachedPackages).toEqual(["a-package", "another-package"]);
    expect(installedPackages).toEqual(["a-package", "another-package"]);
  });

  it("should restore packages", async () => {
    inputs.packages = "a-package another-package";
    cachedPackages = ["a-package", "another-package"];

    await import("../src/main.js");

    expect(logs).toEqual([
      "Restoring \u001b[34ma-package\u001b[39m cache...",
      "Restoring \u001b[34manother-package\u001b[39m cache...",
    ]);
    expect(process.exitCode).toBeUndefined();

    expect(cachedPackages).toEqual(["a-package", "another-package"]);
    expect(installedPackages).toEqual(["a-package", "another-package"]);
  });
});
