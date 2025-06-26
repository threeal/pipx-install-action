/**
 * Parses the name and version of a Pipx package from a package string.
 *
 * @param str - The package string to parse, either in the format `name==version` or just `name`.
 * @returns An object containing the parsed package name and version. If the version is not specified, it defaults to `latest`.
 * @throws An error if the package string cannot be parsed.
 */
export function parsePipxPackage(pkg: string): {
  name: string;
  version: string;
} {
  const match = /^([\w\d._-]+)(==([\d.]+))?$/.exec(pkg);
  if (match == null || match.length < 2) {
    throw new Error(`unable to parse package name and version from: ${pkg}`);
  }

  return {
    name: match[1],
    version: match[3] || "latest",
  };
}
