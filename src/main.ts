import core from "@actions/core";
import { pipxInstallAction } from "./action.js";

async function main() {
  const pkgs = core
    .getInput("packages", { required: true })
    .split(/(\s+)/)
    .filter((pkg) => pkg.trim().length > 0);

  await pipxInstallAction(...pkgs);
}

main().catch((err) => core.setFailed(err));
