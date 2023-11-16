import { execSync } from "node:child_process";
import { writeFile, rmSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import pkg from "../package.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildProject() {
  rmSync(resolve(__dirname, "../dist"), { recursive: true, force: true });
  execSync("tsc --project tsconfig.json");
}

async function createPublishFile() {
  copyFileSync(resolve(__dirname, "../README.md"), resolve(__dirname, "../dist/README.md"));

  const template = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: pkg.main.replace("dist/", ""),
    type: pkg.type,
    types: pkg.types.replace("dist/", ""),
    declaration: true,
    author: pkg.author,
    keywords: pkg.keywords,
    license: pkg.license,
    repository: pkg.repository,
    homepage: pkg.homepage,
    bugs: pkg.bugs,
    dependencies: pkg.dependencies,
  };

  writeFile(
    resolve(__dirname, "../dist/package.json"),
    JSON.stringify(template, null, "	"),
    { encoding: "utf8" },
    (err) => console.log(err || `write package.json, current version ${pkg.version}`)
  );
}

async function bootstrap() {
  await buildProject();
  await createPublishFile();
}

void bootstrap();
