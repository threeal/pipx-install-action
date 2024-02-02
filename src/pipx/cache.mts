import { saveCache } from "@actions/cache";
import { getEnvironment } from "./environment.mjs";
import path from "path";

export async function savePackageCache(pkg: string): Promise<void> {
  try {
    const binDir = await getEnvironment("PIPX_BIN_DIR");
    const localVenvs = await getEnvironment("PIPX_LOCAL_VENVS");

    await saveCache(
      [path.join(binDir, `${pkg}*`), path.join(localVenvs, pkg)],
      `pipx-${process.platform}-${pkg}`,
    );
  } catch (err) {
    throw new Error(`Failed to save ${pkg} cache: ${(err as Error).message}`);
  }
}
