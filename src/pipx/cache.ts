import { restoreCache, saveCache } from "cache-action";
import { getErrorMessage } from "catched-error-message";
import { getPipxEnvironment } from "./environment.js";
import path from "path";
import { parsePipxPackage } from "./utils.js";

export async function savePipxPackageCache(pkg: string): Promise<void> {
  try {
    const localVenvs = await getPipxEnvironment("PIPX_LOCAL_VENVS");
    const { name, version } = parsePipxPackage(pkg);

    await saveCache(`pipx-${process.platform}-${name}`, version, [
      path.join(localVenvs, name),
    ]);
  } catch (err) {
    throw new Error(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
  }
}

export async function restorePipxPackageCache(pkg: string): Promise<boolean> {
  try {
    const { name, version } = parsePipxPackage(pkg);
    return await restoreCache(`pipx-${process.platform}-${name}`, version);
  } catch (err) {
    throw new Error(`Failed to restore ${pkg} cache: ${getErrorMessage(err)}`);
  }
}
