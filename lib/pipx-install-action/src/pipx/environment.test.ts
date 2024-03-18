import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("@actions/core", () => ({
  addPath: jest.fn(),
  exportVariable: jest.fn(),
}));

jest.unstable_mockModule("@actions/exec", () => ({
  getExecOutput: jest.fn(),
}));

describe("get pipx environments", () => {
  it("should get an environment", async () => {
    const { getExecOutput } = await import("@actions/exec");
    const { getEnvironment } = await import("./environment.js");

    jest.mocked(getExecOutput).mockReset().mockResolvedValue({
      exitCode: 0,
      stdout: "some value",
      stderr: "",
    });

    const prom = getEnvironment("SOME_ENVIRONMENT");
    await expect(prom).resolves.toBe("some value");

    expect(getExecOutput).toHaveBeenCalledExactlyOnceWith(
      "pipx",
      ["environment", "--value", "SOME_ENVIRONMENT"],
      {
        silent: true,
      },
    );
  });

  it("should fail to get an environment", async () => {
    const { getExecOutput } = await import("@actions/exec");
    const { getEnvironment } = await import("./environment.js");

    jest
      .mocked(getExecOutput)
      .mockReset()
      .mockRejectedValue(new Error("something went wrong"));

    const prom = getEnvironment("SOME_ENVIRONMENT");
    await expect(prom).rejects.toThrow(
      "Failed to get SOME_ENVIRONMENT: something went wrong",
    );
  });
});

describe("ensure pipx path", () => {
  it("should ensure path", async () => {
    const { addPath, exportVariable } = await import("@actions/core");
    const { binDir, ensurePath, homeDir } = await import("./environment.js");

    jest.mocked(addPath).mockReset();
    jest.mocked(exportVariable).mockReset();

    expect(() => ensurePath()).not.toThrow();

    expect(exportVariable).toHaveBeenCalledTimes(2);
    expect(exportVariable).toHaveBeenNthCalledWith(1, "PIPX_HOME", homeDir);
    expect(exportVariable).toHaveBeenNthCalledWith(2, "PIPX_BIN_DIR", binDir);

    expect(addPath).toHaveBeenCalledExactlyOnceWith(binDir);
  });
});
