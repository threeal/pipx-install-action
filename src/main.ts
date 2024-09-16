import { getInput, logError } from "gha-utils";
import { pipxInstallAction } from "./lib.js";

try {
  const pkgs = getInput("packages")
    .split(/(\s+)/)
    .filter((pkg) => pkg.trim().length > 0);

  await pipxInstallAction(...pkgs);
} catch (err) {
  logError(err);
  process.exit(1);
}
