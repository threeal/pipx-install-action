import { jest } from "@jest/globals";
import { binDir, homeDir } from "./environment.js";

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

jest.unstable_mockModule("node:child_process", () => ({
  spawn: (file: string, args: string[], options: object): ChildProcess => {
    expect([file, args.length, args[0], options]).toEqual([
      "pipx",
      2,
      "install",
      {
        stdio: "inherit",
        env: {
          PATH: process.env.PATH,
          PIPX_HOME: homeDir,
          PIPX_BIN_DIR: binDir,
        },
      },
    ]);

    return new ChildProcess({ close: [args[1] === "a-package" ? 0 : 1] });
  },
}));

describe("install Python packages", () => {
  it("should install a package", async () => {
    const { installPackage } = await import("./install.js");

    await installPackage("a-package");
  });

  it("should fail to install a package", async () => {
    const { installPackage } = await import("./install.js");

    await expect(installPackage("an-invalid-package")).rejects.toThrow(
      "Failed to install an-invalid-package: process exited with code: 1",
    );
  });
});
