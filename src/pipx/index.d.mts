import { restorePackageCache, savePackageCache } from "./cache.mjs";
import { ensurePath, getEnvironment } from "./environment.mjs";
import { installPackage } from "./install.mjs";
declare const _default: {
    ensurePath: typeof ensurePath;
    getEnvironment: typeof getEnvironment;
    installPackage: typeof installPackage;
    restorePackageCache: typeof restorePackageCache;
    savePackageCache: typeof savePackageCache;
};
export default _default;
