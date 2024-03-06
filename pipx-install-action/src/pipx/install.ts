import { exec } from "@actions/exec";
import { getErrorMessage } from "catched-error-message";

export async function installPackage(pkg: string): Promise<void> {
  try {
    await exec("pipx", ["install", pkg]);
  } catch (err) {
    throw new Error(`Failed to install ${pkg}: ${getErrorMessage(err)}`);
  }
}
