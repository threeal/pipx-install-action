import { jest } from "@jest/globals";

let paths: string[] = [];
let variables: { [key: string]: string } = {};

jest.unstable_mockModule("@actions/core", () => ({
  addPath: (inputPath: string) => {
    paths.push(inputPath);
  },
  exportVariable: (name: string, val: string) => {
    variables[name] = val;
  },
}));

jest.unstable_mockModule("@actions/exec", () => ({
  getExecOutput: async (
    commandLine: string,
    args: string[],
    options: { silent: boolean },
  ) => {
    expect(commandLine).toBe("pipx");
    expect(args.length).toBe(3);
    expect(args[0]).toBe("environment");
    expect(args[1]).toBe("--value");
    expect(options).toBeDefined();
    expect(options.silent).toBe(true);

    switch (args[2]) {
      case "PIPX_LOCAL_VENVS":
        return { stdout: "/path/to/venvs" };

      default:
        throw new Error("unknown environment");
    }
  },
}));

jest.unstable_mockModule("os", () => ({
  default: {
    homedir: () => "user-home",
  },
}));

describe("get pipx environments", () => {
  it("should successfully get an environment", async () => {
    const { getEnvironment } = await import("./environment.js");

    const prom = getEnvironment("PIPX_LOCAL_VENVS");
    await expect(prom).resolves.toBe("/path/to/venvs");
  });

  it("should fail to get an invalid environment", async () => {
    const { getEnvironment } = await import("./environment.js");

    const prom = getEnvironment("INVALID_ENV");
    await expect(prom).rejects.toThrow("Failed to get INVALID_ENV");
  });
});

describe("ensure pipx path", () => {
  beforeEach(() => {
    paths = [];
    variables = {
      PIPX_HOME: "/path/to/home",
      PIPX_BIN_DIR: "/path/to/bin",
    };
  });

  it("should successfully ensure path", async () => {
    const { ensurePath } = await import("./environment.js");

    expect(() => ensurePath()).not.toThrow();

    expect(variables["PIPX_HOME"]).toMatch(/^user-home/);
    expect(variables["PIPX_BIN_DIR"]).toMatch(/^user-home/);

    expect(paths).toContain(variables["PIPX_BIN_DIR"]);
  });
});
