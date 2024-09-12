import { restoreCache, saveCache } from "@actions/cache";
import { getErrorMessage } from "catched-error-message";
import { getEnvironment } from "./environment.js";
import path from "path";
import { parsePackage } from "./utils.js";

export async function savePackageCache(pkg: string): Promise<void> {
  try {
    const localVenvs = await getEnvironment("PIPX_LOCAL_VENVS");
    const { name, version } = parsePackage(pkg);

    await saveCache(
      [path.join(localVenvs, name)],
      `pipx-${process.platform}-${name}-${version}`,
    );
  } catch (err) {
    throw new Error(`Failed to save ${pkg} cache: ${getErrorMessage(err)}`);
  }
}

export async function restorePackageCache(pkg: string): Promise<boolean> {
  try {
    const localVenvs = await getEnvironment("PIPX_LOCAL_VENVS");
    const { name, version } = parsePackage(pkg);

    const key = await restoreCache(
      [path.join(localVenvs, name)],
      `pipx-${process.platform}-${name}-${version}`,
    );

    return key !== undefined;
  } catch (err) {
    throw new Error(`Failed to restore ${pkg} cache: ${getErrorMessage(err)}`);
  }
}
