import { jest } from "@jest/globals";
import path from "node:path";

jest.unstable_mockModule("gha-utils", () => ({
  addPath: async (sysPath: string) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        process.env.PATH =
          process.env.PATH !== undefined
            ? `${sysPath}${path.delimiter}${process.env.PATH}`
            : sysPath;
        resolve();
      }, 100);
    }),
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
    const { getPipxEnvironment } = await import("./environment.js");

    const value = await getPipxEnvironment("AN_ENVIRONMENT");
    expect(value).toBe("a value");
  });

  it("should fail to get an environment", async () => {
    const { getPipxEnvironment } = await import("./environment.js");

    const prom = getPipxEnvironment("AN_INVALID_ENVIRONMENT");
    await expect(prom).rejects.toThrow(
      "Failed to get AN_INVALID_ENVIRONMENT: unknown environment",
    );
  });
});

describe("add the executable path of pipx packages", () => {
  beforeEach(() => {
    delete process.env.PATH;
  });

  it("should add the path on Windows", async () => {
    const { addPipxPackagePath } = await import("./environment.js");
    Object.defineProperty(process, "platform", { value: "win32" });

    await addPipxPackagePath("a-package");

    expect(process.env.PATH?.split(path.delimiter).reverse()).toEqual([
      path.join("path-to-local-venvs", "a-package", "Scripts"),
    ]);
  });

  it("should add the path on other OS", async () => {
    const { addPipxPackagePath } = await import("./environment.js");
    Object.defineProperty(process, "platform", { value: "other" });

    await addPipxPackagePath("a-package");

    expect(process.env.PATH?.split(path.delimiter).reverse()).toEqual([
      path.join("path-to-local-venvs", "a-package", "bin"),
    ]);
  });

  it("should not add duplicate paths", async () => {
    const { addPipxPackagePath } = await import("./environment.js");
    Object.defineProperty(process, "platform", { value: "other" });

    await addPipxPackagePath("a-package");
    await addPipxPackagePath("a-package");
    await addPipxPackagePath("another-package");

    expect(process.env.PATH?.split(path.delimiter).reverse()).toEqual([
      path.join("path-to-local-venvs", "a-package", "bin"),
      path.join("path-to-local-venvs", "another-package", "bin"),
    ]);
  });
});
