import core from "@actions/core";
import pipx from "./pipx/index.mjs";

export async function pipxInstallAction(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    await core.group(`Installing \u001b[34m${pkg}\u001b[39m...`, async () => {
      await pipx.installPackage(pkg);
    });

    await core.group(`Saving \u001b[34m${pkg}\u001b[39m cache...`, async () => {
      await pipx.savePackageCache(pkg);
    });
  }
}
