import { exec } from "@actions/exec";

export async function pipxInstall(...pkgs: string[]): Promise<void> {
  await Promise.all(pkgs.map((pkg) => exec("pipx", ["install", pkg])));
}
