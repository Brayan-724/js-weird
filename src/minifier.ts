import { ResolvedOptions } from "./types";

let uglify: typeof import("uglify-js");
let prettier: typeof import("prettier");

export async function minifier(
	input: string,
	options: ResolvedOptions
): Promise<string> {
	if (options.minify) {
		uglify = uglify || (await import("uglify-js"));
		return uglify.minify(input, {
			toplevel: false,
			mangle: false,
			compress: false,
		}).code;
	}

	prettier = prettier || (await import("prettier"));
	return prettier.format(input, {
		parser: "babel",
    
	});
}
