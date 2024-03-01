import { jest } from "@jest/globals";

let files: string[] = [];
let cache: { [key: string]: string[] } = {};

jest.unstable_mockModule("./environment.mjs", () => ({
  getEnvironment: async (env: string) => {
    switch (env) {
      case "PIPX_BIN_DIR":
        return "/path/to/bin";
      case "PIPX_LOCAL_VENVS":
        return "/path/to/venvs";
    }
  },
}));

jest.unstable_mockModule("@actions/cache", () => ({
  restoreCache: async (paths: string[], key: string) => {
    if (key in cache) {
      for (const path of paths) {
        if (cache[key].includes(path)) {
          if (!files.includes(path)) files.push(path);
        } else {
          throw new Error(`${path} not found`);
        }
      }
      return key;
    }
    return undefined;
  },
  saveCache: async (paths: string[], key: string) => {
    cache[key] = [];
    for (const path of paths) {
      if (files.includes(path)) {
        cache[key].push(path);
      } else {
        throw new Error(`${path} not found`);
      }
    }
  },
}));

describe("save Python package caches", () => {
  beforeEach(() => {
    files = ["/path/to/bin/ruff*", "/path/to/venvs/ruff"];
    cache = {};
  });

  it("should successfully save a package cache", async () => {
    const { savePackageCache } = await import("./cache.mjs");

    const prom = savePackageCache("ruff");
    await expect(prom).resolves.toBeUndefined();

    expect(cache[`pipx-${process.platform}-ruff`]).toStrictEqual([
      "/path/to/bin/ruff*",
      "/path/to/venvs/ruff",
    ]);
  });

  it("should fail to save a package cache", async () => {
    const { savePackageCache } = await import("./cache.mjs");

    const prom = savePackageCache("invalid-pkg");
    await expect(prom).rejects.toThrow("Failed to save invalid-pkg cache");
  });
});

describe("restore Python package caches", () => {
  beforeEach(() => {
    files = [];
    cache = {
      [`pipx-${process.platform}-ruff`]: [
        "/path/to/bin/ruff*",
        "/path/to/venvs/ruff",
      ],
      [`pipx-${process.platform}-invalid-pkg`]: [],
    };
  });

  it("should successfully restore a saved package cache", async () => {
    const { restorePackageCache } = await import("./cache.mjs");

    const prom = restorePackageCache("ruff");
    await expect(prom).resolves.toBe(true);

    expect(files).toStrictEqual(["/path/to/bin/ruff*", "/path/to/venvs/ruff"]);
  });

  it("should successfully restore an unsaved package cache", async () => {
    const { restorePackageCache } = await import("./cache.mjs");

    const prom = restorePackageCache("black");
    await expect(prom).resolves.toBe(false);

    expect(files).toStrictEqual([]);
  });

  it("should fail to restore a package cache", async () => {
    const { restorePackageCache } = await import("./cache.mjs");

    const prom = restorePackageCache("invalid-pkg");
    await expect(prom).rejects.toThrow("Failed to restore invalid-pkg cache");
  });
});
