import { getExecOutput } from "@actions/exec";

export async function getEnvironment(env: string): Promise<string> {
  try {
    const res = await getExecOutput("pipx", ["environment", "--value", env]);
    return res.stdout;
  } catch (err) {
    throw new Error(`Failed to get ${env}: ${(err as Error).message}`);
  }
}
