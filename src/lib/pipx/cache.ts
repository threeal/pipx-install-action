import { restoreCache, saveCache } from "cache-action";
import { getErrorMessage } from "catched-error-message";
import path from "path";
import { addPipxPackagePath, getPipxEnvironment } from "./environment.js";
import { parsePipxPackage } from "./utils.js";

export const pipxPackageCacheVersion = "pipx-install-action-2.0.0";

export async function savePipxPackageCache(pkg: string): Promise<void> {
  try {
    const localVenvs = await getPipxEnvironment("PIPX_LOCAL_VENVS");
    const { name } = parsePipxPackage(pkg);
    await saveCache(
      `pipx-${process.platform}-${pkg}`,
      pipxPackageCacheVersion,
      [path.join(localVenvs, name)],
    );
  } catch (err) {
    throw new Error(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
  }
}

export async function restorePipxPackageCache(pkg: string): Promise<boolean> {
  try {
    const restored = await restoreCache(
      `pipx-${process.platform}-${pkg}`,
      pipxPackageCacheVersion,
    );
    if (restored) await addPipxPackagePath(pkg);
    return restored;
  } catch (err) {
    throw new Error(`Failed to restore ${pkg} cache: ${getErrorMessage(err)}`);
  }
}
