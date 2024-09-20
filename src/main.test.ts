import { jest } from "@jest/globals";

describe("install Python packages", () => {
  let logs: string[] = [];
  let inputs: Record<string, string | undefined> = {};
  jest.unstable_mockModule("gha-utils", () => ({
    beginLogGroup(name: string): void {
      logs.push(`::group::${name}`);
    },
    endLogGroup(): void {
      logs.push("::endgroup::");
    },
    getInput(name: string): string {
      return inputs[name] ?? "";
    },
    logError(err: Error): void {
      logs.push(`::error::${err.message}`);
    },
    logInfo(message: string): void {
      logs.push(message);
    },
  }));

  let cachedPackages: string[] = [];
  const restorePipxPackageCache = jest.fn<(pkg: string) => Promise<boolean>>();
  const savePipxPackageCache = jest.fn<(pkg: string) => Promise<void>>();
  jest.unstable_mockModule("./pipx/cache.js", () => ({
    restorePipxPackageCache,
    savePipxPackageCache,
  }));

  let installedPackages: string[] = [];
  const installPipxPackage = jest.fn<(pkg: string) => Promise<void>>();
  jest.unstable_mockModule("./pipx/install.js", () => ({
    installPipxPackage,
  }));

  beforeEach(() => {
    jest.resetModules();

    logs = [];
    inputs = {};

    cachedPackages = [];
    installedPackages = [];

    restorePipxPackageCache.mockImplementation((pkg) => {
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

    savePipxPackageCache.mockImplementation((pkg) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          cachedPackages.push(pkg);
          resolve();
        }, 100);
      });
    });

    installPipxPackage.mockImplementation((pkg: string) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          installedPackages.push(pkg);
          resolve();
        }, 100);
      });
    });

    process.exitCode = undefined;
  });

  it("should fail to restore a package cache", async () => {
    inputs["packages"] = "a-package";

    restorePipxPackageCache.mockRejectedValue(new Error("unknown error"));

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
    inputs["packages"] = "a-package";

    installPipxPackage.mockRejectedValue(new Error("unknown error"));

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
    inputs["packages"] = "a-package";

    savePipxPackageCache.mockRejectedValue(new Error("unknown error"));

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
    inputs["packages"] = "a-package another-package";

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
    inputs["packages"] = "a-package another-package";
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
