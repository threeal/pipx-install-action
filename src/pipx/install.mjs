import { exec } from "@actions/exec";
export async function installPackage(pkg) {
    try {
        await exec("pipx", ["install", pkg]);
    }
    catch (err) {
        throw new Error(`Failed to install ${pkg}: ${err.message}`);
    }
}
