import 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawn, execFile } from 'node:child_process';
import path$1 from 'path';

function r(r){return function(r){if("object"==typeof(e=r)&&null!==e&&"message"in e&&"string"==typeof e.message)return r;var e;try{return new Error(JSON.stringify(r))}catch(e){return new Error(String(r))}}(r).message}

/**
 * @internal
 * Retrieves the value of an environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not defined.
 */
function mustGetEnvironment(name) {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`the ${name} environment variable must be defined`);
    }
    return value;
}
/**
 * Retrieves the value of a GitHub Actions input.
 *
 * @param name - The name of the GitHub Actions input.
 * @returns The value of the GitHub Actions input, or an empty string if not found.
 */
function getInput(name) {
    const value = process.env[`INPUT_${name.toUpperCase()}`] ?? "";
    return value.trim();
}
/**
 * Adds a system path to the environment in GitHub Actions.
 *
 * @param sysPath - The system path to add to the environment.
 * @returns A promise that resolves when the system path is successfully added.
 */
async function addPath(sysPath) {
    process.env.PATH =
        process.env.PATH !== undefined
            ? `${sysPath}${path.delimiter}${process.env.PATH}`
            : sysPath;
    const filePath = mustGetEnvironment("GITHUB_PATH");
    await fsPromises.appendFile(filePath, `${sysPath}${os.EOL}`);
}

/**
 * Logs an information message in GitHub Actions.
 *
 * @param message - The information message to log.
 */
function logInfo(message) {
    process.stdout.write(`${message}${os.EOL}`);
}
/**
 * Logs an error message in GitHub Actions.
 *
 * @param err - The error, which can be of any type.
 */
function logError(err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stdout.write(`::error::${message}${os.EOL}`);
}
/**
 * Begins a log group in GitHub Actions.
 *
 * @param name - The name of the log group.
 */
function beginLogGroup(name) {
    process.stdout.write(`::group::${name}${os.EOL}`);
}
/**
 * Ends the current log group in GitHub Actions.
 */
function endLogGroup() {
    process.stdout.write(`::endgroup::${os.EOL}`);
}

async function fetchCacheService(method, body) {
    const url = process.env.ACTIONS_RESULTS_URL ?? "/";
    const token = process.env.ACTIONS_RUNTIME_TOKEN ?? "";
    return fetch(`${url}twirp/github.actions.results.api.v1.CacheService/${method}`, {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}
async function handleCacheServiceError(res) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
        const data = await res.json();
        if (typeof data === "object" && data && "msg" in data) {
            throw new Error(`${data.msg} (${res.status.toFixed()})`);
        }
    }
    throw new Error(`${res.statusText} (${res.status.toFixed()})`);
}
async function getCacheEntryDownloadUrl(key, version) {
    const res = await fetchCacheService("GetCacheEntryDownloadURL", {
        key,
        version,
    });
    if (!res.ok) {
        await handleCacheServiceError(res);
    }
    return (await res.json());
}
async function createCacheEntry(key, version) {
    const res = await fetchCacheService("CreateCacheEntry", {
        key,
        version,
    });
    if (!res.ok) {
        if (res.status == 409)
            return { ok: false, signed_upload_url: "" };
        await handleCacheServiceError(res);
    }
    return (await res.json());
}
async function finalizeCacheEntryUpload(key, version, sizeBytes) {
    const res = await fetchCacheService("FinalizeCacheEntryUpload", {
        key,
        version,
        sizeBytes,
    });
    if (!res.ok) {
        await handleCacheServiceError(res);
    }
    return (await res.json());
}

class ProcessError extends Error {
    constructor(args, code, output) {
        let message = "Process failed";
        if (code !== null)
            message += ` (${code.toString()})`;
        message += `: ${args.join(" ")}`;
        const trimmedOutput = output.trim();
        if (trimmedOutput !== "")
            message += `\n${trimmedOutput}`;
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
async function waitProcess(proc) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        proc.stderr.on("data", (chunk) => chunks.push(chunk));
        proc.on("error", reject);
        proc.on("close", (code) => {
            if (code === 0) {
                resolve(undefined);
            }
            else {
                const output = Buffer.concat(chunks).toString();
                reject(new ProcessError(proc.spawnargs, code, output));
            }
        });
    });
}
async function createArchive(archivePath, filePaths) {
    const tar = spawn("tar", ["-cf", "-", "-P", ...filePaths]);
    const zstd = spawn("zstd", ["-T0", "-o", archivePath]);
    tar.stdout.pipe(zstd.stdin);
    await Promise.all([waitProcess(tar), waitProcess(zstd)]);
}
async function extractArchive(archivePath) {
    const zstd = spawn("zstd", ["-d", "-T0", "-c", archivePath]);
    const tar = spawn("tar", ["-xf", "-", "-P"]);
    zstd.stdout.pipe(tar.stdin);
    await Promise.all([waitProcess(zstd), waitProcess(tar)]);
}
async function azureStorageCopy(source, destination) {
    const azcopy = spawn("azcopy", [
        "copy",
        "--skip-version-check",
        "--block-size-mb",
        "32",
        source,
        destination,
    ]);
    await waitProcess(azcopy);
}

/**
 * Restores files from the cache using the specified key and version.
 *
 * @param key - The cache key.
 * @param version - The cache version.
 * @returns A promise that resolves to a boolean value indicating whether the
 * file was restored successfully.
 */
async function restoreCache(key, version) {
    const versionHash = createHash("sha256").update(version).digest("hex");
    const res = await getCacheEntryDownloadUrl(key, versionHash);
    if (!res.ok)
        return false;
    const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "temp-"));
    const archivePath = path.join(tempDir, "cache.tar.zst");
    await azureStorageCopy(res.signed_download_url, archivePath);
    await extractArchive(archivePath);
    await fsPromises.rm(tempDir, { recursive: true });
    return true;
}
/**
 * Saves files to the cache using the specified key and version.
 *
 * @param key - The cache key.
 * @param version - The cache version.
 * @param filePaths - The paths of the files to be saved.
 * @returns A promise that resolves to a boolean value indicating whether the
 * file was saved successfully.
 */
async function saveCache(key, version, filePaths) {
    const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "temp-"));
    const archivePath = path.join(tempDir, "cache.tar.zst");
    await createArchive(archivePath, filePaths);
    const archiveStat = await fsPromises.stat(archivePath);
    const versionHash = createHash("sha256").update(version).digest("hex");
    const res = await createCacheEntry(key, versionHash);
    if (res.ok) {
        await azureStorageCopy(archivePath, res.signed_upload_url);
        const { ok } = await finalizeCacheEntryUpload(key, versionHash, archiveStat.size);
        res.ok = ok;
    }
    await fsPromises.rm(tempDir, { recursive: true });
    return res.ok;
}

/**
 * Parses the name and version of a Pipx package from a package string.
 *
 * @param str - The package string to parse, either in the format `name==version` or just `name`.
 * @returns An object containing the parsed package name and version. If the version is not specified, it defaults to `latest`.
 * @throws An error if the package string cannot be parsed.
 */
function parsePipxPackage(pkg) {
    const match = /^([\w\d._-]+)(==([\d.]+))?$/.exec(pkg);
    if (match == null || match.length < 2) {
        throw new Error(`unable to parse package name and version from: ${pkg}`);
    }
    return {
        name: match[1],
        version: match[3] || "latest",
    };
}

async function getPipxEnvironment(env) {
    return new Promise((resolve, reject) => {
        execFile("pipx", ["environment", "--value", env], { env: { PATH: process.env.PATH } }, (err, stdout) => {
            if (err) {
                reject(new Error(`Failed to get ${env}: ${err.message}`));
            }
            else {
                resolve(stdout.trim());
            }
        });
    });
}
/**
 * Appends the executable path of a Pipx package to the system path.
 *
 * @param pkg - The name of the Pipx package.
 *
 * @returns A promise that resolves once the system path has been successfully updated.
 */
async function addPipxPackagePath(pkg) {
    const localVenvs = await getPipxEnvironment("PIPX_LOCAL_VENVS");
    const { name } = parsePipxPackage(pkg);
    const pkgPath = process.platform === "win32"
        ? path$1.join(localVenvs, name, "Scripts")
        : path$1.join(localVenvs, name, "bin");
    // Skip if already added to the system path.
    if (process.env.PATH?.includes(pkgPath))
        return;
    await addPath(pkgPath);
}

const pipxPackageCacheVersion = "pipx-install-action-2.0.0";
async function savePipxPackageCache(pkg) {
    try {
        const localVenvs = await getPipxEnvironment("PIPX_LOCAL_VENVS");
        const { name } = parsePipxPackage(pkg);
        await saveCache(`pipx-${process.platform}-${pkg}`, pipxPackageCacheVersion, [path$1.join(localVenvs, name)]);
    }
    catch (err) {
        throw new Error(`Failed to save ${pkg} cache: ${r(err)}`);
    }
}
async function restorePipxPackageCache(pkg) {
    try {
        const restored = await restoreCache(`pipx-${process.platform}-${pkg}`, pipxPackageCacheVersion);
        if (restored)
            await addPipxPackagePath(pkg);
        return restored;
    }
    catch (err) {
        throw new Error(`Failed to restore ${pkg} cache: ${r(err)}`);
    }
}

async function installPipxPackage(pkg) {
    try {
        const pipx = spawn("pipx", ["install", pkg], {
            stdio: "inherit",
            env: { PATH: process.env.PATH },
        });
        await new Promise((resolve, reject) => {
            pipx.on("error", reject);
            pipx.on("close", (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    let message = "process exited";
                    if (code !== null)
                        message += ` with code: ${code.toString()}`;
                    reject(new Error(message));
                }
            });
        });
        await addPipxPackagePath(pkg);
    }
    catch (err) {
        throw new Error(`Failed to install ${pkg}: ${r(err)}`);
    }
}

try {
    const pkgs = getInput("packages")
        .split(/(\s+)/)
        .filter((pkg) => pkg.trim().length > 0);
    for (const pkg of pkgs) {
        let cacheFound;
        logInfo(`Restoring \u001b[34m${pkg}\u001b[39m cache...`);
        try {
            cacheFound = await restorePipxPackageCache(pkg);
        }
        catch (err) {
            throw new Error(`Failed to restore ${pkg} cache: ${r(err)}`);
        }
        if (!cacheFound) {
            beginLogGroup(`Cache not found, installing \u001b[34m${pkg}\u001b[39m...`);
            try {
                await installPipxPackage(pkg);
            }
            catch (err) {
                endLogGroup();
                throw new Error(`Failed to install ${pkg}: ${r(err)}`);
            }
            endLogGroup();
            logInfo(`Saving \u001b[34m${pkg}\u001b[39m cache...`);
            try {
                await savePipxPackageCache(pkg);
            }
            catch (err) {
                throw new Error(`Failed to save ${pkg} cache: ${r(err)}`);
            }
        }
    }
}
catch (err) {
    logError(err);
    process.exitCode = 1;
}
