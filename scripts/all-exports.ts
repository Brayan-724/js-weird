import { dirname, join } from "node:path";
import { addExport } from "./add-export";

const [_, binPath, debug] = process.argv;

const allExports = {
  index: ["index"],
};

async function main() {
  for (const [name, exports] of Object.entries(allExports)) {
    for (const exportName of exports) {
      await addExport(
        join(dirname(binPath), ".."),
        name,
        exportName,
        debug === "true" || Boolean(debug)
      );
    }
  }
}

main();
