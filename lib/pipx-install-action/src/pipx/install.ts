import { exec } from "@actions/exec";
import { getErrorMessage } from "catched-error-message";
import { binDir, homeDir } from "./environment.js";

export async function installPackage(pkg: string): Promise<void> {
  try {
    await exec("pipx", ["install", pkg], {
      env: {
        PIPX_HOME: homeDir,
        PIPX_BIN_DIR: binDir,
      },
    });
  } catch (err) {
    throw new Error(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
  }
}
