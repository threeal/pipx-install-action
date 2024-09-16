export interface Package {
  name: string;
  version: string | "latest";
}

/**
 * Parses the package name and version from the given string.
 *
 * @param pkg - The package string to parse in the format "name==version" or just "name".
 * @returns A `Package` object containing the parsed package name and version.
 *          If the version is not specified, it defaults to "latest".
 * @throws An error if the package string cannot be parsed.
 */
export function parsePackage(pkg: string): Package {
  const match = pkg.match(/^([\w\d._-]+)(==([\d.]+))?$/);
  if (match == null || match.length < 2) {
    throw new Error(`unable to parse package name and version from: ${pkg}`);
  }

  return {
    name: match[1],
    version: match[3] ?? "latest",
  };
}
