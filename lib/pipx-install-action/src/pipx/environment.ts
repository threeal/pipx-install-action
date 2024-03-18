import * as core from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { getErrorMessage } from "catched-error-message";
import os from "os";
import path from "path";

export const homeDir = path.join(os.homedir(), ".local/pipx");
export const binDir = path.join(os.homedir(), ".local/bin");

export async function getEnvironment(env: string): Promise<string> {
  try {
    const res = await getExecOutput("pipx", ["environment", "--value", env], {
      silent: true,
    });
    return res.stdout;
  } catch (err) {
    throw new Error(`Failed to get ${env}: ${getErrorMessage(err)}`);
  }
}

export function ensurePath() {
  core.exportVariable("PIPX_HOME", homeDir);
  core.exportVariable("PIPX_BIN_DIR", binDir);

  core.addPath(binDir);
}
