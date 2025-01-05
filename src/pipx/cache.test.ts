import { restoreCache, saveCache } from "cache-action";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  pipxPackageCacheVersion,
  restorePipxPackageCache,
  savePipxPackageCache,
} from "./cache.js";

import { addPipxPackagePath, getPipxEnvironment } from "./environment.js";

vi.mock("cache-action", () => ({
  restoreCache: vi.fn(),
  saveCache: vi.fn(),
}));

vi.mock("./environment.js", () => ({
  addPipxPackagePath: vi.fn(),
  getPipxEnvironment: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getPipxEnvironment).mockImplementation(async (env) => {
    return env === "PIPX_LOCAL_VENVS" ? "/path/to/venvs" : "";
  });
});

describe("save Python package caches", () => {
  it("should save a package cache", async () => {
    vi.mocked(saveCache).mockReset();

    const prom = savePipxPackageCache("some-package");
    await expect(prom).resolves.toBeUndefined();

    expect(saveCache).toHaveBeenCalledOnce();
    expect(saveCache).toHaveBeenCalledWith(
      `pipx-${process.platform}-some-package`,
      pipxPackageCacheVersion,
      ["/path/to/venvs/some-package"],
    );
  });

  it("should fail to save a package cache", async () => {
    vi.mocked(saveCache)
      .mockReset()
      .mockImplementation(() => {
        throw new Error("something went wrong");
      });

    const prom = savePipxPackageCache("some-package");
    await expect(prom).rejects.toThrow(
      "Failed to save some-package cache: something went wrong",
    );
  });
});

describe("restore Python package caches", () => {
  it("should restore a saved package cache", async () => {
    vi.mocked(restoreCache).mockReset().mockResolvedValue(true);
    vi.mocked(addPipxPackagePath).mockReset();

    const prom = restorePipxPackageCache("some-package");
    await expect(prom).resolves.toBe(true);

    expect(restoreCache).toHaveBeenCalledOnce();
    expect(restoreCache).toHaveBeenCalledWith(
      `pipx-${process.platform}-some-package`,
      pipxPackageCacheVersion,
    );

    expect(addPipxPackagePath).toHaveBeenCalledOnce();
    expect(addPipxPackagePath).toHaveBeenCalledWith("some-package");
  });

  it("should restore an unsaved package cache", async () => {
    vi.mocked(restoreCache).mockReset().mockResolvedValue(false);
    vi.mocked(addPipxPackagePath).mockReset();

    const prom = restorePipxPackageCache("some-package");
    await expect(prom).resolves.toBe(false);

    expect(restoreCache).toHaveBeenCalledOnce();
    expect(restoreCache).toHaveBeenCalledWith(
      `pipx-${process.platform}-some-package`,
      pipxPackageCacheVersion,
    );

    expect(addPipxPackagePath).toHaveBeenCalledTimes(0);
  });

  it("should fail to restore a package cache", async () => {
    vi.mocked(restoreCache)
      .mockReset()
      .mockImplementation(() => {
        throw new Error("something went wrong");
      });

    vi.mocked(addPipxPackagePath).mockReset();

    const prom = restorePipxPackageCache("some-package");
    await expect(prom).rejects.toThrow(
      "Failed to restore some-package cache: something went wrong",
    );

    expect(addPipxPackagePath).toHaveBeenCalledTimes(0);
  });
});
