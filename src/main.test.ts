import { jest } from "@jest/globals";

describe("install Python packages", () => {
  let installedPackages: string[] = [];
  jest.unstable_mockModule("./lib.js", () => ({
    pipxInstallAction: (...pkgs: string[]): void => {
      for (const pkg of pkgs) {
        if (pkg === "invalid") throw new Error("invalid package");
        installedPackages.push(pkg);
      }
    },
  }));

  let inputs: Record<string, string | undefined> = {};
  let loggedError: unknown;
  jest.unstable_mockModule("gha-utils", () => ({
    getInput: (name: string): string => {
      return inputs[name] ?? "";
    },
    logError: (err: unknown) => {
      loggedError = err;
    },
  }));

  beforeEach(() => {
    jest.resetModules();

    installedPackages = [];
    inputs = {};
    loggedError = undefined;
  });

  it("should install packages", async () => {
    inputs["packages"] = "a-package another-package";

    await import("../src/main.js");

    expect(installedPackages).toEqual(["a-package", "another-package"]);
    expect(loggedError).toBeUndefined();
  });

  it("should fail to install an invalid package", async () => {
    inputs["packages"] = "invalid";

    await import("./main.js");

    expect(installedPackages).toEqual([]);
    expect(loggedError).toEqual(new Error("invalid package"));
  });
});
