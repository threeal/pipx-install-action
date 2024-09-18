import { addPath } from "gha-utils";
import { execFile } from "node:child_process";
import os from "os";
import path from "path";
import { parsePipxPackage } from "./utils.js";

export const homeDir = path.join(os.homedir(), ".local/pipx");

export async function getPipxEnvironment(env: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    execFile(
      "pipx",
      ["environment", "--value", env],
      {
        env: {
          PATH: process.env["PATH"],
          PIPX_HOME: homeDir,
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
 * Appends the executable path of a Pipx package to the system paths.
 *
 * @param pkg - The name of the Pipx package.
 *
 * @returns A promise that resolves once the system paths has been successfully updated.
 */
export async function addPipxPackagePath(pkg: string): Promise<void> {
  const localVenvs = await getPipxEnvironment("PIPX_LOCAL_VENVS");
  const { name } = parsePipxPackage(pkg);

  if (process.platform === "win32") {
    await addPath(path.join(localVenvs, name, "Scripts"));
  } else {
    await addPath(path.join(localVenvs, name, "bin"));
  }
}
