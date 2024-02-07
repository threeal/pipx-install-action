import core from "@actions/core";
import { getExecOutput } from "@actions/exec";
import os from "os";
import path from "path";

export async function getEnvironment(env: string): Promise<string> {
  try {
    const res = await getExecOutput("pipx", ["environment", "--value", env]);
    return res.stdout;
  } catch (err) {
    throw new Error(`Failed to get ${env}: ${(err as Error).message}`);
  }
}

export function ensurePath() {
  const homeDir = path.join(os.homedir(), ".local/pipx");
  const binDir = path.join(os.homedir(), ".local/bin");

  core.exportVariable("PIPX_HOME", homeDir);
  core.exportVariable("PIPX_BIN_DIR", binDir);

  core.addPath(binDir);
}
