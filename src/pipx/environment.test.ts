import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addPipxPackagePath, getPipxEnvironment } from "./environment.js";

vi.mock("gha-utils", () => ({
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

vi.mock("node:child_process", () => ({
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
        { env: { PATH: process.env["PATH"] } },
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
    const value = await getPipxEnvironment("AN_ENVIRONMENT");
    expect(value).toBe("a value");
  });

  it("should fail to get an environment", async () => {
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
    Object.defineProperty(process, "platform", { value: "win32" });

    await addPipxPackagePath("a-package");

    expect(process.env.PATH?.split(path.delimiter).reverse()).toEqual([
      path.join("path-to-local-venvs", "a-package", "Scripts"),
    ]);
  });

  it("should add the path on other OS", async () => {
    Object.defineProperty(process, "platform", { value: "other" });

    await addPipxPackagePath("a-package");

    expect(process.env.PATH?.split(path.delimiter).reverse()).toEqual([
      path.join("path-to-local-venvs", "a-package", "bin"),
    ]);
  });

  it("should not add duplicate paths", async () => {
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
