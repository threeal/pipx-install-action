import core from "@actions/core";
import { installPackage } from "./pipx/install.mjs";

export async function pipxInstallAction(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    await core.group(`Installing \u001b[34m${pkg}\u001b[39m...`, async () => {
      await installPackage(pkg);
    });
  }
}
