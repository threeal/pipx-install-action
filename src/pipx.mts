import core from "@actions/core";
import { exec } from "@actions/exec";

export async function pipxInstall(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    await core.group(`Installing ${pkg}...`, async () => {
      await exec("pipx", ["install", pkg]);
    });
  }
}
