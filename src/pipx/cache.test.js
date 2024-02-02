import { jest } from "@jest/globals";

let files = [];
let cache = {};

jest.unstable_mockModule("./environment.mjs", () => ({
  getEnvironment: async (env) => {
    switch (env) {
      case "PIPX_BIN_DIR":
        return "/path/to/bin";
      case "PIPX_LOCAL_VENVS":
        return "/path/to/venvs";
    }
  },
}));

jest.unstable_mockModule("@actions/cache", () => ({
  saveCache: async (paths, key) => {
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
    cache = [];
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
