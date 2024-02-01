import { exec } from "@actions/exec";

export async function pipxInstall(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    await exec("pipx", ["install", pkg]);
  }
}
