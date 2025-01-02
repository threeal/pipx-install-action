import { beforeEach, describe, expect, it, vi } from "vitest";
import { installPipxPackage } from "./install.js";

class ChildProcess {
  #events: Record<string, any[] | undefined> = {};

  constructor(events: Record<string, any[]>) {
    this.#events = events;
  }

  on(event: string, callback: (...args: any[]) => any): void {
    const args = this.#events[event];
    if (args !== undefined) callback(...args);
  }
}

vi.mock("node:child_process", () => ({
  spawn: (file: string, args: string[], options: object): ChildProcess => {
    expect([file, args.length, args[0], options]).toEqual([
      "pipx",
      2,
      "install",
      {
        stdio: "inherit",
        env: { PATH: process.env.PATH },
      },
    ]);

    return new ChildProcess({ close: [args[1] === "a-package" ? 0 : 1] });
  },
}));

let addedPackagePaths: string[] = [];
vi.mock("./environment.js", () => ({
  addPipxPackagePath: async (pkg: string) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        addedPackagePaths.push(pkg);
        resolve();
      }, 100);
    }),
}));

describe("install Python packages", () => {
  beforeEach(() => {
    addedPackagePaths = [];
  });

  it("should install a package", async () => {
    await installPipxPackage("a-package");

    expect(addedPackagePaths).toEqual(["a-package"]);
  });

  it("should fail to install a package", async () => {
    await expect(installPipxPackage("an-invalid-package")).rejects.toThrow(
      "Failed to install an-invalid-package: process exited with code: 1",
    );

    expect(addedPackagePaths).toEqual([]);
  });
});
