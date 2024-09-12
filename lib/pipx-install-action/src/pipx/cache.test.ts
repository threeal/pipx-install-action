import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("cache-action", () => ({
  restoreCache: jest.fn(),
  saveCache: jest.fn(),
}));

jest.unstable_mockModule("./environment.js", () => ({
  getEnvironment: jest.fn(),
}));

beforeEach(async () => {
  const { getEnvironment } = await import("./environment.js");

  jest.mocked(getEnvironment).mockImplementation(async (env) => {
    return env === "PIPX_LOCAL_VENVS" ? "/path/to/venvs" : "";
  });
});

describe("save Python package caches", () => {
  it("should save a package cache", async () => {
    const { saveCache } = await import("cache-action");
    const { savePackageCache } = await import("./cache.js");

    jest.mocked(saveCache).mockReset();

    const prom = savePackageCache("some-package");
    await expect(prom).resolves.toBeUndefined();

    expect(saveCache).toHaveBeenCalledExactlyOnceWith(
      `pipx-${process.platform}-some-package`,
      "latest",
      ["/path/to/venvs/some-package"],
    );
  });

  it("should fail to save a package cache", async () => {
    const { saveCache } = await import("cache-action");
    const { savePackageCache } = await import("./cache.js");

    jest
      .mocked(saveCache)
      .mockReset()
      .mockImplementation(() => {
        throw new Error("something went wrong");
      });

    const prom = savePackageCache("some-package");
    await expect(prom).rejects.toThrow(
      "Failed to save some-package cache: something went wrong",
    );
  });
});

describe("restore Python package caches", () => {
  it("should restore a saved package cache", async () => {
    const { restoreCache } = await import("cache-action");
    const { restorePackageCache } = await import("./cache.js");

    jest.mocked(restoreCache).mockReset().mockResolvedValue(true);

    const prom = restorePackageCache("some-package");
    await expect(prom).resolves.toBe(true);

    expect(restoreCache).toHaveBeenCalledExactlyOnceWith(
      `pipx-${process.platform}-some-package`,
      "latest",
    );
  });

  it("should restore an unsaved package cache", async () => {
    const { restoreCache } = await import("cache-action");
    const { restorePackageCache } = await import("./cache.js");

    jest.mocked(restoreCache).mockReset().mockResolvedValue(false);

    const prom = restorePackageCache("some-package");
    await expect(prom).resolves.toBe(false);

    expect(restoreCache).toHaveBeenCalledExactlyOnceWith(
      `pipx-${process.platform}-some-package`,
      "latest",
    );
  });

  it("should fail to restore a package cache", async () => {
    const { restoreCache } = await import("cache-action");
    const { restorePackageCache } = await import("./cache.js");

    jest
      .mocked(restoreCache)
      .mockReset()
      .mockImplementation(() => {
        throw new Error("something went wrong");
      });

    const prom = restorePackageCache("some-package");
    await expect(prom).rejects.toThrow(
      "Failed to restore some-package cache: something went wrong",
    );
  });
});
