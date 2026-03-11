import * as fs from "node:fs/promises";
import { getDependencies, getLicenseText } from "@quantco/pnpm-licenses";
import type { Dependency } from '../src/types';

const ALLOWED_LICENSES: string[] = [
  "0BSD",
  "Apache-2.0",
  "Apache-2.0 AND LGPL-3.0-or-later",
  "Apache-2.0 AND MIT",
  "BSD",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BSD-4-Clause",
  "CC0-1.0",
  "ISC",
  "LGPL-3.0-or-later",
  "MIT",
  "MIT OR CC0-1.0",
  "OFL-1.1",
  "Python-2.0",
  "BlueOak-1.0.0",
];

const dependencies = await getDependencies(
  { prod: true },
  {
    stdin: false,
    stdout: false,
    inputFile: undefined,
    outputFile: "",
  },
);

const output: Dependency[] = [];
for (const dependency of dependencies) {
  if (!isAllowedLicense(dependency.license)) {
    console.error(
      `Disallowed license found: "${dependency.license}" (${dependency.name}@${dependency.version})`,
    );
    process.exit(1);
  }
  const { licenseText } = await getLicenseText(dependency);
  if (dependency.homepage && !isSafeHomepageURL(dependency.homepage)) {
    console.error(
      `Unsafe homepage URL found: "${dependency.homepage}" (${dependency.name}@${dependency.version})`,
    );
    process.exit(1);
  }

  output.push({
    name: dependency.name,
    version: dependency.version,
    license: dependency.license,
    homepage: dependency.homepage,
    licenseText,
  });
}

output.sort((a, b) => a.version.localeCompare(b.version));
output.sort((a, b) => a.name.localeCompare(b.name));

await fs.mkdir(".astro", { recursive: true });
await fs.writeFile(".astro/licenses.json", JSON.stringify(output, null, 2));

console.log("Successfully generated .astro/licenses.json!");

function isAllowedLicense(license: string): boolean {
  return ALLOWED_LICENSES.some(
    (allowed) => license === allowed || license === `(${allowed})`,
  );
}

function isSafeHomepageURL(inputURL: string): boolean {
  const url = new URL(inputURL);
  return ["http:", "https:"].includes(url.protocol);
}
