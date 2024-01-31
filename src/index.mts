import core from "@actions/core";
import { pipxInstall } from "./pipx.mjs";

async function main() {
  const pkgs = core
    .getInput("packages", { required: true })
    .split(/(\s+)/)
    .filter((pkg) => pkg.trim().length > 0);

  await pipxInstall(...pkgs);
}

main().catch((err) => core.setFailed(err));
