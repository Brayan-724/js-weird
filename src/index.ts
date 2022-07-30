import { Options } from "./types";
import { resolveOptions } from "./utils/config";
import { minifier } from "./minifier";
import { fromString } from "./parse";
import { VariableManager } from "./variable";
import { generateMap } from "./map";

export async function compile(
	code: string,
	options?: Options
): Promise<string> {
	const resolvedOptions = resolveOptions(options || {});
	VariableManager.reset(resolvedOptions);
	generateMap(resolvedOptions);

	let out = `(()=>{})[${fromString(
		"constructor",
		resolvedOptions
	)}](${fromString(code, resolvedOptions, true)})()`;
	// let outCode = "";

	for (const var_ of VariableManager.getOrder()) {
		const _var = VariableManager.get(var_);
		out = _var.declaration + out;
	}

	return await minifier(out, resolvedOptions);
}
