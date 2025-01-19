import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import https from 'node:https';
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

/**
 * Sends an HTTP request containing raw data.
 *
 * @param req - The HTTP request object.
 * @param data - The raw data to be sent in the request body.
 * @returns A promise that resolves to an HTTP response object.
 */
async function sendRequest(req, data) {
    return new Promise((resolve, reject) => {
        req.on("response", (res) => resolve(res));
        req.on("error", reject);
        if (data !== undefined)
            req.write(data);
        req.end();
    });
}
/**
 * Sends an HTTP request containing JSON data.
 *
 * @param req - The HTTP request object.
 * @param data - The JSON data to be sent in the request body.
 * @returns A promise that resolves to an HTTP response object.
 */
async function sendJsonRequest(req, data) {
    req.setHeader("Content-Type", "application/json");
    return sendRequest(req, JSON.stringify(data));
}
/**
 * Sends an HTTP request containing a binary stream.
 *
 * @param req - The HTTP request object.
 * @param bin - The binary stream to be sent in the request body.
 * @param start - The starting byte of the binary stream.
 * @param end - The ending byte of the binary stream.
 * @returns A promise that resolves to an HTTP response object.
 */
async function sendStreamRequest(req, bin, start, end) {
    return new Promise((resolve, reject) => {
        req.setHeader("Content-Type", "application/octet-stream");
        req.setHeader("Content-Range", `bytes ${start}-${end}/*`);
        req.on("response", (res) => resolve(res));
        req.on("error", reject);
        bin.pipe(req);
    });
}
/**
 * Asserts whether the content type of the given HTTP incoming message matches
 * the expected type.
 *
 * @param msg - The HTTP incoming message.
 * @param expectedType - The expected content type of the message.
 * @throws {Error} Throws an error if the content type does not match the
 * expected type.
 */
function assertIncomingMessageContentType(msg, expectedType) {
    const actualType = msg.headers["content-type"] ?? "undefined";
    if (!actualType.includes(expectedType)) {
        throw new Error(`expected content type to be '${expectedType}', but instead got '${actualType}'`);
    }
}
/**
 * Waits until an HTTP incoming message has ended.
 *
 * @param msg - The HTTP incoming message.
 * @returns A promise that resolves when the incoming message ends.
 */
async function waitIncomingMessage(msg) {
    return new Promise((resolve, reject) => {
        msg.on("data", () => {
            /** discarded **/
        });
        msg.on("end", resolve);
        msg.on("error", reject);
    });
}
/**
 * Reads the data from an HTTP incoming message.
 *
 * @param msg - The HTTP incoming message.
 * @returns A promise that resolves to the buffered data from the message.
 */
async function readIncomingMessage(msg) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        msg.on("data", (chunk) => chunks.push(chunk));
        msg.on("end", () => resolve(Buffer.concat(chunks)));
        msg.on("error", reject);
    });
}
/**
 * Reads the JSON data from an HTTP incoming message.
 *
 * @typeParam T - The expected type of the parsed JSON data.
 * @param msg - The HTTP incoming message.
 * @returns A promise that resolves to the parsed JSON data from the message.
 */
async function readJsonIncomingMessage(msg) {
    assertIncomingMessageContentType(msg, "application/json");
    const buffer = await readIncomingMessage(msg);
    return JSON.parse(buffer.toString());
}
/**
 * Reads the error data from an HTTP incoming message.
 *
 * @param msg - The HTTP incoming message.
 * @returns A promise that resolves to an `Error` object based on the error
 * data from the message.
 */
async function readErrorIncomingMessage(msg) {
    const buffer = await readIncomingMessage(msg);
    const contentType = msg.headers["content-type"];
    if (contentType !== undefined) {
        if (contentType.includes("application/json")) {
            const data = JSON.parse(buffer.toString());
            if (typeof data === "object" && "message" in data) {
                return new Error(`${data["message"]} (${msg.statusCode})`);
            }
        }
        else if (contentType.includes("application/xml")) {
            const data = buffer.toString().match(/<Message>(.*?)<\/Message>/s);
            if (data !== null && data.length > 1) {
                return new Error(`${data[1]} (${msg.statusCode})`);
            }
        }
    }
    return new Error(`${buffer.toString()} (${msg.statusCode})`);
}

function createCacheRequest(resourcePath, options) {
    const url = `${process.env["ACTIONS_CACHE_URL"]}_apis/artifactcache/${resourcePath}`;
    const req = https.request(url, options);
    req.setHeader("Accept", "application/json;api-version=6.0-preview");
    const bearer = `Bearer ${process.env["ACTIONS_RUNTIME_TOKEN"]}`;
    req.setHeader("Authorization", bearer);
    return req;
}
/**
 * Sends a request to retrieve cache information for the specified key and version.
 *
 * @param key - The cache key.
 * @param version - The cache version.
 * @returns A promise that resolves with the cache information or null if not found.
 */
async function requestGetCache(key, version) {
    const resourcePath = `cache?keys=${key}&version=${version}`;
    const req = createCacheRequest(resourcePath, { method: "GET" });
    const res = await sendRequest(req);
    switch (res.statusCode) {
        case 200:
            return await readJsonIncomingMessage(res);
        // Cache not found, return null.
        case 204:
            await waitIncomingMessage(res);
            return null;
        default:
            throw await readErrorIncomingMessage(res);
    }
}
/**
 * Sends a request to reserve a cache with the specified key, version, and size.
 *
 * @param key - The key of the cache to reserve.
 * @param version - The version of the cache to reserve.
 * @param size - The size of the cache to reserve, in bytes.
 * @returns A promise that resolves to the reserved cache ID, or null if the
 * cache is already reserved.
 */
async function requestReserveCache(key, version, size) {
    const req = createCacheRequest("caches", { method: "POST" });
    const res = await sendJsonRequest(req, { key, version, cacheSize: size });
    switch (res.statusCode) {
        case 201: {
            const { cacheId } = await readJsonIncomingMessage(res);
            return cacheId;
        }
        // Cache already reserved, return null.
        case 409:
            await waitIncomingMessage(res);
            return null;
        default:
            throw await readErrorIncomingMessage(res);
    }
}
/**
 * Sends multiple requests to upload a file to the cache with the specified ID.
 *
 * @param id - The cache ID.
 * @param filePath - The path of the file to upload.
 * @param fileSize - The size of the file to upload, in bytes.
 * @param options - The upload options.
 * @param options.maxChunkSize - The maximum size of each chunk to be uploaded,
 * in bytes. Defaults to 4 MB.
 * @returns A promise that resolves when the file has been uploaded.
 */
async function requestUploadCache(id, filePath, fileSize, options) {
    const { maxChunkSize } = {
        maxChunkSize: 4 * 1024 * 1024,
        ...options,
    };
    const proms = [];
    for (let start = 0; start < fileSize; start += maxChunkSize) {
        proms.push((async () => {
            const end = Math.min(start + maxChunkSize - 1, fileSize);
            const bin = fs.createReadStream(filePath, { start, end });
            const req = createCacheRequest(`caches/${id}`, { method: "PATCH" });
            const res = await sendStreamRequest(req, bin, start, end);
            switch (res.statusCode) {
                case 204:
                    await waitIncomingMessage(res);
                    break;
                default:
                    throw await readErrorIncomingMessage(res);
            }
        })());
    }
    await Promise.all(proms);
}
/**
 * Sends a request to commit a cache with the specified ID.
 *
 * @param id - The cache ID.
 * @param size - The size of the cache to be committed, in bytes.
 * @returns A promise that resolves when the cache has been committed.
 */
async function requestCommitCache(id, size) {
    const req = createCacheRequest(`caches/${id}`, { method: "POST" });
    const res = await sendJsonRequest(req, { size });
    if (res.statusCode !== 204) {
        throw await readErrorIncomingMessage(res);
    }
    await waitIncomingMessage(res);
}

/**
 * Waits for a child process to exit.
 *
 * @param proc - The child process to wait for.
 * @returns A promise that resolves when the child process exits successfully,
 * or rejects if the process fails.
 */
async function waitChildProcess(proc) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        proc.stderr?.on("data", (chunk) => chunks.push(chunk));
        proc.on("error", reject);
        proc.on("close", (code) => {
            if (code === 0) {
                resolve(undefined);
            }
            else {
                reject(new Error([
                    `Process failed: ${proc.spawnargs.join(" ")}`,
                    Buffer.concat(chunks).toString(),
                ].join("\n")));
            }
        });
    });
}
/**
 * Creates a compressed archive from files using Tar and Zstandard.
 *
 * @param archivePath - The output path for the compressed archive.
 * @param filePaths - The paths of the files to be archived.
 * @returns A promise that resolves when the compressed archive is created.
 */
async function createArchive(archivePath, filePaths) {
    const tar = spawn("tar", ["-cf", "-", "-P", ...filePaths]);
    const zstd = spawn("zstd", ["-T0", "-o", archivePath]);
    tar.stdout.pipe(zstd.stdin);
    await Promise.all([waitChildProcess(tar), waitChildProcess(zstd)]);
}
/**
 * Extracts files from a compressed archive using Tar and Zstandard.
 *
 * @param archivePath - The path to the compressed archive to be extracted.
 * @returns A promise that resolves when the files have been successfully extracted.
 */
async function extractArchive(archivePath) {
    const zstd = spawn("zstd", ["-d", "-T0", "-c", archivePath]);
    const tar = spawn("tar", ["-xf", "-", "-P"]);
    zstd.stdout.pipe(tar.stdin);
    await Promise.all([waitChildProcess(zstd), waitChildProcess(tar)]);
}

/**
 * Retrieves the file size of a file to be downloaded from the specified URL.
 *
 * @param url - The URL of the file to be downloaded.
 * @returns A promise that resolves to the size of the file to be downloaded, in bytes.
 */
async function getDownloadFileSize(url) {
    const req = https.request(url, { method: "HEAD" });
    const res = await sendRequest(req);
    switch (res.statusCode) {
        case 200: {
            await readIncomingMessage(res);
            return Number.parseInt(res.headers["content-length"]);
        }
        default:
            throw await readErrorIncomingMessage(res);
    }
}
/**
 * Downloads a file from the specified URL and saves it to the provided path.
 *
 * @param url - The URL of the file to be downloaded.
 * @param savePath - The path where the downloaded file will be saved.
 * @param options - The download options.
 * @param options.maxChunkSize - The maximum size of each chunk to be downloaded
 * in bytes. Defaults to 4 MB.
 * @returns A promise that resolves when the download is complete.
 */
async function downloadFile(url, savePath, options) {
    const { maxChunkSize } = {
        maxChunkSize: 4 * 1024 * 1024,
        ...options,
    };
    const [file, fileSize] = await Promise.all([
        fsPromises.open(savePath, "w"),
        getDownloadFileSize(url),
    ]);
    const proms = [];
    for (let start = 0; start < fileSize; start += maxChunkSize) {
        proms.push((async () => {
            const end = Math.min(start + maxChunkSize - 1, fileSize);
            const req = https.request(url, { method: "GET" });
            req.setHeader("range", `bytes=${start}-${end}`);
            const res = await sendRequest(req);
            if (res.statusCode === 206) {
                assertIncomingMessageContentType(res, "application/octet-stream");
                const buffer = await readIncomingMessage(res);
                await file.write(buffer, 0, buffer.length, start);
            }
            else {
                throw await readErrorIncomingMessage(res);
            }
        })());
    }
    await Promise.all(proms);
    await file.close();
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
    const cache = await requestGetCache(key, version);
    if (cache === null)
        return false;
    const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "temp-"));
    const archivePath = path.join(tempDir, "cache.tar.zst");
    await downloadFile(cache.archiveLocation, archivePath);
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
    const cacheId = await requestReserveCache(key, version, archiveStat.size);
    if (cacheId === null) {
        await fsPromises.rm(tempDir, { recursive: true });
        return false;
    }
    await requestUploadCache(cacheId, archivePath, archiveStat.size);
    await requestCommitCache(cacheId, archiveStat.size);
    await fsPromises.rm(tempDir, { recursive: true });
    return true;
}

/**
 * Parses the name and version of a Pipx package from a package string.
 *
 * @param str - The package string to parse, either in the format `name==version` or just `name`.
 * @returns An object containing the parsed package name and version. If the version is not specified, it defaults to `latest`.
 * @throws An error if the package string cannot be parsed.
 */
function parsePipxPackage(pkg) {
    const match = pkg.match(/^([\w\d._-]+)(==([\d.]+))?$/);
    if (match == null || match.length < 2) {
        throw new Error(`unable to parse package name and version from: ${pkg}`);
    }
    return {
        name: match[1],
        version: match[3] ?? "latest",
    };
}

async function getPipxEnvironment(env) {
    return new Promise((resolve, reject) => {
        execFile("pipx", ["environment", "--value", env], { env: { PATH: process.env["PATH"] } }, (err, stdout) => {
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
            env: { PATH: process.env["PATH"] },
        });
        await new Promise((resolve, reject) => {
            pipx.on("error", reject);
            pipx.on("close", (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`process exited with code: ${code}`));
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
