import { addPath } from "gha-utils";
import { execFile } from "node:child_process";
import os from "os";
import path from "path";
import { parsePackage } from "./utils.js";

export const homeDir = path.join(os.homedir(), ".local/pipx");
export const binDir = path.join(os.homedir(), ".local/bin");

export async function getEnvironment(env: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    execFile(
      "pipx",
      ["environment", "--value", env],
      {
        env: {
          PATH: process.env["PATH"],
          PIPX_HOME: homeDir,
          PIPX_BIN_DIR: binDir,
        },
      },
      (err, stdout) => {
        if (err) {
          reject(new Error(`Failed to get ${env}: ${err.message}`));
        } else {
          resolve(stdout.trim());
        }
      },
    );
  });
}

/**
 * Appends the binary path of a specified package to the system paths.
 *
 * @param pkg - The name of the package.
 * @returns A promise that resolves when the system paths have been successfully appended.
 */
export async function addPackagePath(pkg: string): Promise<void> {
  const localVenvs = await getEnvironment("PIPX_LOCAL_VENVS");
  const { name } = parsePackage(pkg);

  if (process.platform === "win32") {
    addPath(path.join(localVenvs, name, "Scripts"));
  } else {
    addPath(path.join(localVenvs, name, "bin"));
  }
}
