import { getErrorMessage } from "catched-error-message";

import {
  beginLogGroup,
  endLogGroup,
  getInput,
  logError,
  logInfo,
} from "gha-utils";

import { restorePipxPackageCache, savePipxPackageCache } from "./pipx/cache.js";
import { installPipxPackage } from "./pipx/install.js";

try {
  const pkgs = getInput("packages")
    .split(/(\s+)/)
    .filter((pkg) => pkg.trim().length > 0);

  for (const pkg of pkgs) {
    let cacheFound: boolean;
    logInfo(`Restoring \u001b[34m${pkg}\u001b[39m cache...`);
    try {
      cacheFound = await restorePipxPackageCache(pkg);
    } catch (err) {
      throw new Error(
        `Failed to restore ${pkg} cache: ${getErrorMessage(err)}`,
      );
    }

    if (!cacheFound) {
      beginLogGroup(
        `Cache not found, installing \u001b[34m${pkg}\u001b[39m...`,
      );
      try {
        await installPipxPackage(pkg);
      } catch (err) {
        endLogGroup();
        throw new Error(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
      }
      endLogGroup();

      logInfo(`Saving \u001b[34m${pkg}\u001b[39m cache...`);
      try {
        await savePipxPackageCache(pkg);
      } catch (err) {
        throw new Error(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
      }
    }
  }
} catch (err) {
  logError(err);
  process.exitCode = 1;
}
