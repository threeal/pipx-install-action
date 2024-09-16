import { jest } from "@jest/globals";
import path from "node:path";

let sysPaths: string[] = [];
beforeEach(() => (sysPaths = []));

jest.unstable_mockModule("gha-utils", () => ({
  addPath: (sysPath: string) => {
    sysPaths.push(sysPath);
  },
}));

let homeDir: string;
beforeAll(async () => {
  const env = await import("./environment.js");
  homeDir = env.homeDir;
});

jest.unstable_mockModule("node:child_process", () => ({
  execFile: (
    file: string,
    args: string[],
    options: any,
    callback: (...args: any[]) => void,
  ) => {
    try {
      expect([file, args.length, args.slice(0, 2), options]).toEqual([
        "pipx",
        3,
        ["environment", "--value"],
        {
          env: {
            PATH: process.env["PATH"],
            PIPX_HOME: homeDir,
          },
        },
      ]);

      if (args[2] === "AN_ENVIRONMENT") {
        callback(null, "  a value\n");
      } else if (args[2] === "PIPX_LOCAL_VENVS") {
        callback(null, "path-to-local-venvs");
      } else {
        callback(new Error("unknown environment"));
      }
    } catch (err) {
      callback(err);
    }
  },
}));

describe("get pipx environments", () => {
  it("should get an environment", async () => {
    const { getEnvironment } = await import("./environment.js");

    const value = await getEnvironment("AN_ENVIRONMENT");
    expect(value).toBe("a value");
  });

  it("should fail to get an environment", async () => {
    const { getEnvironment } = await import("./environment.js");

    const prom = getEnvironment("AN_INVALID_ENVIRONMENT");
    await expect(prom).rejects.toThrow(
      "Failed to get AN_INVALID_ENVIRONMENT: unknown environment",
    );
  });
});

describe("add path of pipx packages", () => {
  it("should add path of a pipx package on Windows", async () => {
    const { addPackagePath } = await import("./environment.js");
    Object.defineProperty(process, "platform", { value: "win32" });

    await addPackagePath("a-package");

    expect(sysPaths).toEqual([
      path.join("path-to-local-venvs", "a-package", "Scripts"),
    ]);
  });

  it("should add path of a pipx package on other OS", async () => {
    const { addPackagePath } = await import("./environment.js");
    Object.defineProperty(process, "platform", { value: "other" });

    await addPackagePath("a-package");

    expect(sysPaths).toEqual([
      path.join("path-to-local-venvs", "a-package", "bin"),
    ]);
  });
});
