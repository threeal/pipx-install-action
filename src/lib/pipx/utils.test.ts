import { describe, expect, it } from "vitest";
import { parsePipxPackage } from "./utils.js";

describe("parse name and version of Pipx packages from package strings", () => {
  it("should parse from a package string with a version specifier", () => {
    expect(parsePipxPackage("a-package==1.2.3")).toEqual({
      name: "a-package",
      version: "1.2.3",
    });
  });

  it("should parse from a package string without a version specifier", () => {
    expect(parsePipxPackage("a-package")).toEqual({
      name: "a-package",
      version: "latest",
    });
  });

  it("should fail to parse from an invalid package string", () => {
    expect(() => parsePipxPackage("???")).toThrow(
      "unable to parse package name and version from: ???",
    );
  });
});
