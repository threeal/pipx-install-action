import { getErrorMessage } from "catched-error-message";
import { spawn } from "node:child_process";
import { addPipxPackagePath } from "./environment.js";

export async function installPipxPackage(pkg: string): Promise<void> {
  try {
    const pipx = spawn("pipx", ["install", pkg], {
      stdio: "inherit",
      env: { PATH: process.env.PATH },
    });
    await new Promise<void>((resolve, reject) => {
      pipx.on("error", reject);
      pipx.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          let message = "process exited";
          if (code !== null) message += ` with code: ${code.toString()}`;
          reject(new Error(message));
        }
      });
    });
    await addPipxPackagePath(pkg);
  } catch (err) {
    throw new Error(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
  }
}
