import { parsePackage } from "./utils";

describe("parse package strings", () => {
  it("should parse a package string with a version specifier", () => {
    expect(parsePackage("a-package==1.2.3")).toEqual({
      name: "a-package",
      version: "1.2.3",
    });
  });

  it("should parse a package string without a version specifier", () => {
    expect(parsePackage("a-package")).toEqual({
      name: "a-package",
      version: "latest",
    });
  });

  it("should fail to parse an invalid package string", () => {
    expect(() => parsePackage("???")).toThrow(
      "unable to parse package name and version from: ???",
    );
  });
});
