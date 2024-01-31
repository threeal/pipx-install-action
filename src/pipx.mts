import { exec } from "@actions/exec";

export async function pipxInstall(pkg: string): Promise<void> {
  await exec("pipx", ["install", pkg]);
}
