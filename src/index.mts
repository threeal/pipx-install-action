import core from "@actions/core";
import { pipxInstall } from "./pipx.mjs";

async function main() {
  const pkg = core.getInput("package", { required: true });
  await pipxInstall(pkg);
}

main().catch((err) => core.setFailed(err));
