import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("./environment.js", () => ({
  getEnvironment: jest.fn(),
}));

jest.unstable_mockModule("@actions/cache", () => ({
  restoreCache: jest.fn(),
  saveCache: jest.fn(),
}));

beforeEach(async () => {
  const { getEnvironment } = await import("./environment.js");

  jest.mocked(getEnvironment).mockImplementation(async (env) => {
    switch (env) {
      case "PIPX_BIN_DIR":
        return "/path/to/bin";
      case "PIPX_LOCAL_VENVS":
        return "/path/to/venvs";
    }
    return "";
  });
});

describe("save Python package caches", () => {
  it("should save a package cache", async () => {
    const { saveCache } = await import("@actions/cache");
    const { savePackageCache } = await import("./cache.js");

    jest.mocked(saveCache).mockReset();

    const prom = savePackageCache("some-package");
    await expect(prom).resolves.toBeUndefined();

    expect(saveCache).toHaveBeenCalledExactlyOnceWith(
      ["/path/to/bin/some-package*", "/path/to/venvs/some-package"],
      `pipx-${process.platform}-some-package-latest`,
    );
  });

  it("should fail to save a package cache", async () => {
    const { saveCache } = await import("@actions/cache");
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
    const { restoreCache } = await import("@actions/cache");
    const { restorePackageCache } = await import("./cache.js");

    jest
      .mocked(restoreCache)
      .mockReset()
      .mockResolvedValue(`pipx-${process.platform}-some-package`);

    const prom = restorePackageCache("some-package");
    await expect(prom).resolves.toBe(true);

    expect(restoreCache).toHaveBeenCalledExactlyOnceWith(
      ["/path/to/bin/some-package*", "/path/to/venvs/some-package"],
      `pipx-${process.platform}-some-package-latest`,
    );
  });

  it("should restore an unsaved package cache", async () => {
    const { restoreCache } = await import("@actions/cache");
    const { restorePackageCache } = await import("./cache.js");

    jest.mocked(restoreCache).mockReset().mockResolvedValue(undefined);

    const prom = restorePackageCache("some-package");
    await expect(prom).resolves.toBe(false);

    expect(restoreCache).toHaveBeenCalledExactlyOnceWith(
      ["/path/to/bin/some-package*", "/path/to/venvs/some-package"],
      `pipx-${process.platform}-some-package-latest`,
    );
  });

  it("should fail to restore a package cache", async () => {
    const { restoreCache } = await import("@actions/cache");
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
