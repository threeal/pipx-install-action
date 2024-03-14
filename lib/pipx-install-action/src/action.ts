import * as core from "@actions/core";
import { getErrorMessage } from "catched-error-message";
import pipx from "./pipx/index.js";

export async function pipxInstallAction(...pkgs: string[]): Promise<void> {
  core.info("Ensuring pipx path...");
  try {
    pipx.ensurePath();
  } catch (err) {
    core.setFailed(`Failed to ensure pipx path: ${getErrorMessage(err)}`);
    return;
  }

  for (const pkg of pkgs) {
    let cacheFound: boolean;
    core.startGroup(`Restoring \u001b[34m${pkg}\u001b[39m cache...`);
    try {
      cacheFound = await pipx.restorePackageCache(pkg);
    } catch (err) {
      core.endGroup();
      core.setFailed(`Failed to restore ${pkg} cache: ${getErrorMessage(err)}`);
      return;
    }
    core.endGroup();

    if (!cacheFound) {
      core.startGroup(
        `Cache not found, installing \u001b[34m${pkg}\u001b[39m...`,
      );
      try {
        await pipx.installPackage(pkg);
      } catch (err) {
        core.endGroup();
        core.setFailed(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
        return;
      }
      core.endGroup();

      core.startGroup(`Saving \u001b[34m${pkg}\u001b[39m cache...`);
      try {
        await pipx.savePackageCache(pkg);
      } catch (err) {
        core.endGroup();
        core.setFailed(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
        return;
      }
      core.endGroup();
    }
  }
}
