import { exec } from "@actions/exec";
import { pipxInstall } from "./pipx.mjs";

describe("install Python packages", () => {
  beforeAll(async () => {
    await Promise.all([
      exec("pipx", ["install", "black"]),
      exec("pipx", ["install", "ruff"]),
    ]);
  });

  it("should successfully install packages", async () => {
    const prom = pipxInstall("black", "ruff");
    await expect(prom).resolves.toBeUndefined();
  });

  it("should fail to install an invalid package", async () => {
    const prom = pipxInstall("invalid-pkg");
    await expect(prom).rejects.toThrow();
  });
});
