import * as core from "@actions/core";
import { getErrorMessage } from "catched-error-message";
import { pipxInstallAction } from "pipx-install-action";

try {
  const pkgs = core
    .getInput("packages", { required: true })
    .split(/(\s+)/)
    .filter((pkg) => pkg.trim().length > 0);

  await pipxInstallAction(...pkgs);
} catch (err) {
  core.setFailed(getErrorMessage(err));
}
