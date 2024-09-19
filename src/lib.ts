import { getErrorMessage } from "catched-error-message";
import { beginLogGroup, endLogGroup, logError, logInfo } from "gha-utils";
import { restorePipxPackageCache, savePipxPackageCache } from "./pipx/cache.js";
import { addPipxPackagePath } from "./pipx/environment.js";
import { installPipxPackage } from "./pipx/install.js";

export async function pipxInstallAction(...pkgs: string[]): Promise<void> {
  for (const pkg of pkgs) {
    let cacheFound: boolean;
    logInfo(`Restoring \u001b[34m${pkg}\u001b[39m cache...`);
    try {
      cacheFound = await restorePipxPackageCache(pkg);
      if (cacheFound) await addPipxPackagePath(pkg);
    } catch (err) {
      logError(`Failed to restore ${pkg} cache: ${getErrorMessage(err)}`);
      process.exitCode = 1;
      return;
    }

    if (!cacheFound) {
      beginLogGroup(
        `Cache not found, installing \u001b[34m${pkg}\u001b[39m...`,
      );
      try {
        await installPipxPackage(pkg);
      } catch (err) {
        endLogGroup();
        logError(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
        process.exitCode = 1;
        return;
      }
      endLogGroup();

      logInfo(`Saving \u001b[34m${pkg}\u001b[39m cache...`);
      try {
        await savePipxPackageCache(pkg);
      } catch (err) {
        logError(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
        process.exitCode = 1;
        return;
      }
    }
  }
}
