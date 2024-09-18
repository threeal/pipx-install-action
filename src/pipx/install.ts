import { getErrorMessage } from "catched-error-message";
import { spawn } from "node:child_process";
import { homeDir } from "./environment.js";

export async function installPipxPackage(pkg: string): Promise<void> {
  try {
    const pipx = spawn("pipx", ["install", pkg], {
      stdio: "inherit",
      env: {
        PATH: process.env["PATH"],
        PIPX_HOME: homeDir,
      },
    });
    await new Promise<void>((resolve, reject) => {
      pipx.on("error", reject);
      pipx.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`process exited with code: ${code}`));
        }
      });
    });
  } catch (err) {
    throw new Error(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
  }
}
