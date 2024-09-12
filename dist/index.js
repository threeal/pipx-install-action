import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 510:
/***/ ((module, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var gha_utils__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(748);
/* harmony import */ var pipx_install_action__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(44);


try {
    const pkgs = (0,gha_utils__WEBPACK_IMPORTED_MODULE_0__/* .getInput */ .Np)("packages")
        .split(/(\s+)/)
        .filter((pkg) => pkg.trim().length > 0);
    await (0,pipx_install_action__WEBPACK_IMPORTED_MODULE_1__/* .pipxInstallAction */ .y)(...pkgs);
}
catch (err) {
    (0,gha_utils__WEBPACK_IMPORTED_MODULE_0__/* .logError */ .H)(err);
    process.exit(1);
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 561:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");

/***/ }),

/***/ 612:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");

/***/ }),

/***/ 411:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");

/***/ }),

/***/ 748:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "H": () => (/* binding */ logError),
/* harmony export */   "Np": () => (/* binding */ getInput),
/* harmony export */   "PN": () => (/* binding */ logInfo),
/* harmony export */   "QM": () => (/* binding */ addPath),
/* harmony export */   "sH": () => (/* binding */ endLogGroup),
/* harmony export */   "zq": () => (/* binding */ beginLogGroup)
/* harmony export */ });
/* unused harmony exports setOutput, setEnv, logWarning, logCommand */
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(561);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(612);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(411);



/**
 * Retrieves the value of a GitHub Actions input.
 *
 * @param name - The name of the GitHub Actions input.
 * @returns The value of the GitHub Actions input, or an empty string if not found.
 */
function getInput(name) {
    const value = process.env[`INPUT_${name.toUpperCase()}`] || "";
    return value.trim();
}
/**
 * Sets the value of a GitHub Actions output.
 *
 * @param name - The name of the GitHub Actions output.
 * @param value - The value of the GitHub Actions output
 */
function setOutput(name, value) {
    fs.appendFileSync(process.env["GITHUB_OUTPUT"], `${name}=${value}${os.EOL}`);
}
/**
 * Sets the value of an environment variable in GitHub Actions.
 *
 * @param name - The name of the environment variable.
 * @param value - The value of the environment variable.
 */
function setEnv(name, value) {
    process.env[name] = value;
    fs.appendFileSync(process.env["GITHUB_ENV"], `${name}=${value}${os.EOL}`);
}
/**
 * Adds a system path to the environment in GitHub Actions.
 *
 * @param sysPath - The system path to add.
 */
function addPath(sysPath) {
    process.env["PATH"] = `${sysPath}${node_path__WEBPACK_IMPORTED_MODULE_2__.delimiter}${process.env["PATH"]}`;
    node_fs__WEBPACK_IMPORTED_MODULE_0__.appendFileSync(process.env["GITHUB_PATH"], `${sysPath}${node_os__WEBPACK_IMPORTED_MODULE_1__.EOL}`);
}
/**
 * Logs an information message in GitHub Actions.
 *
 * @param message - The information message to log.
 */
function logInfo(message) {
    process.stdout.write(`${message}${node_os__WEBPACK_IMPORTED_MODULE_1__.EOL}`);
}
/**
 * Logs a warning message in GitHub Actions.
 *
 * @param message - The warning message to log.
 */
function logWarning(message) {
    process.stdout.write(`::warning::${message}${os.EOL}`);
}
/**
 * Logs an error message in GitHub Actions.
 *
 * @param err - The error, which can be of any type.
 */
function logError(err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stdout.write(`::error::${message}${node_os__WEBPACK_IMPORTED_MODULE_1__.EOL}`);
}
/**
 * Logs a command along with its arguments in GitHub Actions.
 *
 * @param command - The command to log.
 * @param args - The arguments of the command.
 */
function logCommand(command, args) {
    const message = [command, ...args].join(" ");
    process.stdout.write(`[command]${message}${os.EOL}`);
}
/**
 * Begins a log group in GitHub Actions.
 *
 * @param name - The name of the log group.
 */
function beginLogGroup(name) {
    process.stdout.write(`::group::${name}${node_os__WEBPACK_IMPORTED_MODULE_1__.EOL}`);
}
/**
 * Ends the current log group in GitHub Actions.
 */
function endLogGroup() {
    process.stdout.write(`::endgroup::${node_os__WEBPACK_IMPORTED_MODULE_1__.EOL}`);
}


/***/ }),

/***/ 44:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {


// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "y": () => (/* reexport */ pipxInstallAction)
});

;// CONCATENATED MODULE: ../../../.yarn/berry/cache/catched-error-message-npm-0.0.1-9126a73d25-10c0.zip/node_modules/catched-error-message/dist/index.esm.js
function r(r){return function(r){if("object"==typeof(e=r)&&null!==e&&"message"in e&&"string"==typeof e.message)return r;var e;try{return new Error(JSON.stringify(r))}catch(e){return new Error(String(r))}}(r).message}
//# sourceMappingURL=index.esm.js.map

// EXTERNAL MODULE: ../../../.yarn/berry/cache/gha-utils-npm-0.2.0-572860ffdf-10c0.zip/node_modules/gha-utils/dist/index.js
var dist = __nccwpck_require__(748);
;// CONCATENATED MODULE: external "node:fs/promises"
const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs/promises");
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __nccwpck_require__(612);
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __nccwpck_require__(411);
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __nccwpck_require__(561);
;// CONCATENATED MODULE: external "node:https"
const external_node_https_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:https");
;// CONCATENATED MODULE: external "node:child_process"
const external_node_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
;// CONCATENATED MODULE: ../../../.yarn/berry/cache/cache-action-npm-0.2.0-ab6ba29157-10c0.zip/node_modules/cache-action/dist/lib.mjs







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
    const req = external_node_https_namespaceObject.request(url, options);
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
            const bin = external_node_fs_.createReadStream(filePath, { start, end });
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
    const tar = (0,external_node_child_process_namespaceObject.spawn)("tar", ["-cf", "-", "-P", ...filePaths]);
    const zstd = (0,external_node_child_process_namespaceObject.spawn)("zstd", ["-T0", "-o", archivePath]);
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
    const zstd = (0,external_node_child_process_namespaceObject.spawn)("zstd", ["-d", "-T0", "-c", archivePath]);
    const tar = (0,external_node_child_process_namespaceObject.spawn)("tar", ["-xf", "-", "-P"]);
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
    const req = external_node_https_namespaceObject.request(url, { method: "HEAD" });
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
        promises_namespaceObject.open(savePath, "w"),
        getDownloadFileSize(url),
    ]);
    const proms = [];
    for (let start = 0; start < fileSize; start += maxChunkSize) {
        proms.push((async () => {
            const end = Math.min(start + maxChunkSize - 1, fileSize);
            const req = external_node_https_namespaceObject.request(url, { method: "GET" });
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
    const tempDir = await promises_namespaceObject.mkdtemp(external_node_path_.join(external_node_os_.tmpdir(), "temp-"));
    const archivePath = external_node_path_.join(tempDir, "cache.tar.zst");
    await downloadFile(cache.archiveLocation, archivePath);
    await extractArchive(archivePath);
    await promises_namespaceObject.rm(tempDir, { recursive: true });
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
    const tempDir = await promises_namespaceObject.mkdtemp(external_node_path_.join(external_node_os_.tmpdir(), "temp-"));
    const archivePath = external_node_path_.join(tempDir, "cache.tar.zst");
    await createArchive(archivePath, filePaths);
    const archiveStat = await promises_namespaceObject.stat(archivePath);
    const cacheId = await requestReserveCache(key, version, archiveStat.size);
    if (cacheId === null) {
        await promises_namespaceObject.rm(tempDir, { recursive: true });
        return false;
    }
    await requestUploadCache(cacheId, archivePath, archiveStat.size);
    await requestCommitCache(cacheId, archiveStat.size);
    await promises_namespaceObject.rm(tempDir, { recursive: true });
    return true;
}



;// CONCATENATED MODULE: external "os"
const external_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");
;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/pipx/utils.js
/**
 * Parses the package name and version from the given string.
 *
 * @param pkg - The package string to parse in the format "name==version" or just "name".
 * @returns A `Package` object containing the parsed package name and version.
 *          If the version is not specified, it defaults to "latest".
 * @throws An error if the package string cannot be parsed.
 */
function parsePackage(pkg) {
    const match = pkg.match(/^([\w\d._-]+)(==([\d.]+))?$/);
    if (match == null || match.length < 2) {
        throw new Error(`unable to parse package name and version from: ${pkg}`);
    }
    return {
        name: match[1],
        version: match[3] ?? "latest",
    };
}

;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/pipx/environment.js





const homeDir = external_path_namespaceObject.join(external_os_namespaceObject.homedir(), ".local/pipx");
async function getEnvironment(env) {
    return new Promise((resolve, reject) => {
        (0,external_node_child_process_namespaceObject.execFile)("pipx", ["environment", "--value", env], {
            env: {
                PATH: process.env["PATH"],
                PIPX_HOME: homeDir,
            },
        }, (err, stdout) => {
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
 * Appends the binary path of a specified package to the system paths.
 *
 * @param pkg - The name of the package.
 * @returns A promise that resolves when the system paths have been successfully appended.
 */
async function addPackagePath(pkg) {
    const localVenvs = await getEnvironment("PIPX_LOCAL_VENVS");
    const { name } = parsePackage(pkg);
    if (process.platform === "win32") {
        (0,dist/* addPath */.QM)(external_path_namespaceObject.join(localVenvs, name, "Scripts"));
    }
    else {
        (0,dist/* addPath */.QM)(external_path_namespaceObject.join(localVenvs, name, "bin"));
    }
}

;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/pipx/cache.js





async function savePackageCache(pkg) {
    try {
        const localVenvs = await getEnvironment("PIPX_LOCAL_VENVS");
        const { name, version } = parsePackage(pkg);
        await saveCache(`pipx-${process.platform}-${name}`, version, [
            external_path_namespaceObject.join(localVenvs, name),
        ]);
    }
    catch (err) {
        throw new Error(`Failed to save ${pkg} cache: ${r(err)}`);
    }
}
async function restorePackageCache(pkg) {
    try {
        const { name, version } = parsePackage(pkg);
        return await restoreCache(`pipx-${process.platform}-${name}`, version);
    }
    catch (err) {
        throw new Error(`Failed to restore ${pkg} cache: ${r(err)}`);
    }
}

;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/pipx/install.js



async function installPackage(pkg) {
    try {
        const pipx = (0,external_node_child_process_namespaceObject.spawn)("pipx", ["install", pkg], {
            stdio: "inherit",
            env: {
                PATH: process.env["PATH"],
                PIPX_HOME: homeDir,
            },
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
    }
    catch (err) {
        throw new Error(`Failed to install ${pkg}: ${r(err)}`);
    }
}

;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/pipx/index.js



/* harmony default export */ const pipx = ({
    addPackagePath: addPackagePath,
    getEnvironment: getEnvironment,
    installPackage: installPackage,
    restorePackageCache: restorePackageCache,
    savePackageCache: savePackageCache,
});

;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/action.js



async function pipxInstallAction(...pkgs) {
    for (const pkg of pkgs) {
        let cacheFound;
        (0,dist/* logInfo */.PN)(`Restoring \u001b[34m${pkg}\u001b[39m cache...`);
        try {
            cacheFound = await pipx.restorePackageCache(pkg);
            if (cacheFound)
                await pipx.addPackagePath(pkg);
        }
        catch (err) {
            (0,dist/* logError */.H)(`Failed to restore ${pkg} cache: ${r(err)}`);
            process.exitCode = 1;
            return;
        }
        if (!cacheFound) {
            (0,dist/* beginLogGroup */.zq)(`Cache not found, installing \u001b[34m${pkg}\u001b[39m...`);
            try {
                await pipx.installPackage(pkg);
                await pipx.addPackagePath(pkg);
            }
            catch (err) {
                (0,dist/* endLogGroup */.sH)();
                (0,dist/* logError */.H)(`Failed to install ${pkg}: ${r(err)}`);
                process.exitCode = 1;
                return;
            }
            (0,dist/* endLogGroup */.sH)();
            (0,dist/* logInfo */.PN)(`Saving \u001b[34m${pkg}\u001b[39m cache...`);
            try {
                await pipx.savePackageCache(pkg);
            }
            catch (err) {
                (0,dist/* logError */.H)(`Failed to save ${pkg} cache: ${r(err)}`);
                process.exitCode = 1;
                return;
            }
        }
    }
}

;// CONCATENATED MODULE: ./lib/pipx-install-action/dist/index.js



/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && !queue.d) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = 1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(510);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
