import { jest } from "@jest/globals";
import { binDir, homeDir } from "./environment.js";
import "jest-extended";

jest.unstable_mockModule("@actions/exec", () => ({
  exec: jest.fn(),
}));

describe("install Python packages", () => {
  it("should install a package", async () => {
    const { exec } = await import("@actions/exec");
    const { installPackage } = await import("./install.js");

    jest.mocked(exec).mockReset();

    const prom = installPackage("some-package");
    await expect(prom).resolves.toBeUndefined();

    expect(exec).toHaveBeenCalledExactlyOnceWith(
      "pipx",
      ["install", "some-package"],
      {
        env: {
          PIPX_HOME: homeDir,
          PIPX_BIN_DIR: binDir,
        },
      },
    );
  });

  it("should fail to install an package", async () => {
    const { exec } = await import("@actions/exec");
    const { installPackage } = await import("./install.js");

    jest
      .mocked(exec)
      .mockReset()
      .mockRejectedValue(new Error("something went wrong"));

    const prom = installPackage("some-package");
    await expect(prom).rejects.toThrow(
      "Failed to install some-package: something went wrong",
    );
  });
});
