import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("gha-utils", () => ({
  addPath: jest.fn(),
}));

let binDir: string;
let homeDir: string;
beforeAll(async () => {
  const env = await import("./environment.js");
  binDir = env.binDir;
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
            PIPX_BIN_DIR: binDir,
          },
        },
      ]);

      if (args[2] === "AN_ENVIRONMENT") {
        callback(null, "a value");
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

describe("ensure pipx path", () => {
  it("should ensure path", async () => {
    const { addPath } = await import("gha-utils");
    const { binDir, ensurePath } = await import("./environment.js");

    jest.mocked(addPath).mockReset();

    expect(() => ensurePath()).not.toThrow();

    expect(addPath).toHaveBeenCalledExactlyOnceWith(binDir);
  });
});
