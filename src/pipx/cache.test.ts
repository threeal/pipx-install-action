import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("cache-action", () => ({
  restoreCache: jest.fn(),
  saveCache: jest.fn(),
}));

jest.unstable_mockModule("./environment.js", () => ({
  addPipxPackagePath: jest.fn(),
  getPipxEnvironment: jest.fn(),
}));

beforeEach(async () => {
  const { getPipxEnvironment } = await import("./environment.js");

  jest.mocked(getPipxEnvironment).mockImplementation(async (env) => {
    return env === "PIPX_LOCAL_VENVS" ? "/path/to/venvs" : "";
  });
});

describe("save Python package caches", () => {
  it("should save a package cache", async () => {
    const { saveCache } = await import("cache-action");
    const { savePipxPackageCache } = await import("./cache.js");

    jest.mocked(saveCache).mockReset();

    const prom = savePipxPackageCache("some-package");
    await expect(prom).resolves.toBeUndefined();

    expect(saveCache).toHaveBeenCalledExactlyOnceWith(
      `pipx-${process.platform}-some-package`,
      "latest",
      ["/path/to/venvs/some-package"],
    );
  });

  it("should fail to save a package cache", async () => {
    const { saveCache } = await import("cache-action");
    const { savePipxPackageCache } = await import("./cache.js");

    jest
      .mocked(saveCache)
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
    const { restoreCache } = await import("cache-action");
    const { restorePipxPackageCache } = await import("./cache.js");
    const { addPipxPackagePath } = await import("./environment.js");

    jest.mocked(restoreCache).mockReset().mockResolvedValue(true);
    jest.mocked(addPipxPackagePath).mockReset();

    const prom = restorePipxPackageCache("some-package");
    await expect(prom).resolves.toBe(true);

    expect(restoreCache).toHaveBeenCalledExactlyOnceWith(
      `pipx-${process.platform}-some-package`,
      "latest",
    );

    expect(addPipxPackagePath).toHaveBeenCalledExactlyOnceWith("some-package");
  });

  it("should restore an unsaved package cache", async () => {
    const { restoreCache } = await import("cache-action");
    const { restorePipxPackageCache } = await import("./cache.js");
    const { addPipxPackagePath } = await import("./environment.js");

    jest.mocked(restoreCache).mockReset().mockResolvedValue(false);
    jest.mocked(addPipxPackagePath).mockReset();

    const prom = restorePipxPackageCache("some-package");
    await expect(prom).resolves.toBe(false);

    expect(restoreCache).toHaveBeenCalledExactlyOnceWith(
      `pipx-${process.platform}-some-package`,
      "latest",
    );

    expect(addPipxPackagePath).toHaveBeenCalledTimes(0);
  });

  it("should fail to restore a package cache", async () => {
    const { restoreCache } = await import("cache-action");
    const { restorePipxPackageCache } = await import("./cache.js");
    const { addPipxPackagePath } = await import("./environment.js");

    jest
      .mocked(restoreCache)
      .mockReset()
      .mockImplementation(() => {
        throw new Error("something went wrong");
      });

    jest.mocked(addPipxPackagePath).mockReset();

    const prom = restorePipxPackageCache("some-package");
    await expect(prom).rejects.toThrow(
      "Failed to restore some-package cache: something went wrong",
    );

    expect(addPipxPackagePath).toHaveBeenCalledTimes(0);
  });
});
