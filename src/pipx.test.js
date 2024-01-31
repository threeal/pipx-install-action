import { exec } from "@actions/exec";
import { pipxInstall } from "./pipx.mjs";

describe("install Python packages", () => {
  beforeAll(async () => {
    await exec("pipx", ["uninstall", "ruff"], { ignoreReturnCode: true });
  });

  it("should successfully install a package", async () => {
    const prom = pipxInstall("ruff");
    await expect(prom).resolves.toBeUndefined();
  });

  it("should fail to install an invalid package", async () => {
    const prom = pipxInstall("invalid-pkg");
    await expect(prom).rejects.toThrow();
  });
});
