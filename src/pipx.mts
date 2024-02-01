import core from "@actions/core";
import { exec } from "@actions/exec";

export async function pipxInstall(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    await core.group(`Installing ${pkg}...`, async () => {
      try {
        await exec("pipx", ["install", pkg]);
      } catch (err) {
        throw new Error(`Failed to install ${pkg}: ${(err as Error).message}`);
      }
    });
  }
}
