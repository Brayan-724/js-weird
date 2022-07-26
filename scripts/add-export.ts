import * as fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { join as joinPosix } from "node:path/posix";

const [_0, _1, filename, distpath, debug] = process.argv;

export async function addExport(
  basePath: string,
  filename: string,
  outpath: string,
  debug: boolean
) {
  const log: typeof console.log = (...args) =>
    console.log(`\x1b[35m[Add-Export ${filename}]\x1b[0m`, ...args);

  async function writeFile(ext: string, content: string) {
    log(`Writing file (${ext})...`);
    try {
      // log(filename + "." + ext);
      await fs.rm(join(basePath, filename + "." + ext), { force: true });
      await fs.writeFile(join(basePath, filename + "." + ext), content);
    } catch (err) {
      if (!(err instanceof Error)) return console.error(err);
      const _err = err as Error;
      console.log(
        `\x1b[31mError writing file (${ext}): ${_err.name}: ${_err.message}\x1b[0m`
      );
    }
    // log(`File written (${ext}).`);

    console.log(`\x1b[33m - Done ${filename + "." + ext}\x1b[0m`);
  }

  const distPath = joinPosix("lib", outpath);
  const srcPath = joinPosix("src", outpath);

  const declarationFile = (await fs.readFile(distPath + ".d.ts")).toString();
  const sourceFile = (await fs.readFile(distPath + ".js")).toString();
  const declaration = declarationFile.replace(
    /\.\//g,
    "./" + dirname(distPath) + "/"
  );
  const source = sourceFile.replace(/\.\//g, "./" + dirname(distPath) + "/");

  await Promise.all([writeFile("d.ts", declaration), writeFile("js", source)]);

  console.log(`\x1b[32mDone ${filename}!\x1b[0m`);
}

if (require.main === module) {
  addExport(
    process.cwd(),
    filename,
    distpath,
    debug === "true" || Boolean(debug)
  );
}
