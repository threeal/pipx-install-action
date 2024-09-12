import { getErrorMessage } from "catched-error-message";
import { beginLogGroup, endLogGroup, logError } from "gha-utils";
import pipx from "./pipx/index.js";

export async function pipxInstallAction(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    let cacheFound: boolean;
    beginLogGroup(`Restoring \u001b[34m${pkg}\u001b[39m cache...`);
    try {
      cacheFound = await pipx.restorePackageCache(pkg);
      if (cacheFound) await pipx.addPackagePath(pkg);
    } catch (err) {
      endLogGroup();
      logError(`Failed to restore ${pkg} cache: ${getErrorMessage(err)}`);
      process.exitCode = 1;
      return;
    }
    endLogGroup();

    if (!cacheFound) {
      beginLogGroup(
        `Cache not found, installing \u001b[34m${pkg}\u001b[39m...`,
      );
      try {
        await pipx.installPackage(pkg);
        await pipx.addPackagePath(pkg);
      } catch (err) {
        endLogGroup();
        logError(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
        process.exitCode = 1;
        return;
      }
      endLogGroup();

      beginLogGroup(`Saving \u001b[34m${pkg}\u001b[39m cache...`);
      try {
        await pipx.savePackageCache(pkg);
      } catch (err) {
        endLogGroup();
        logError(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
        process.exitCode = 1;
        return;
      }
      endLogGroup();
    }
  }
}
