import { addPath } from "gha-utils";
import { execFile } from "node:child_process";
import os from "os";
import path from "path";

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
          resolve(stdout);
        }
      },
    );
  });
}

export function ensurePath() {
  addPath(binDir);
}
