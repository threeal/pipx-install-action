import { jest } from "@jest/globals";

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

    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenLastCalledWith("pipx", ["install", "some-package"]);
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
