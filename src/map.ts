import {
	fromString,
	getArrayConstructor,
	getBool,
	getInfinity,
	getNaN,
	getObject,
	getRegexConstructor,
	getStringConstructor,
	smartNumber,
} from "./parse";
import { ResolvedOptions } from "./types";

function setFrom(val: string, str: string, options: ResolvedOptions): void {
	const s = `(${val})[`;
	for (const [i, ch] of str.split("").entries()) {
		if (!options.map.get(ch))
			options.map.set(ch, s + smartNumber(i, options) + "]");
	}
}

/**
 * Chars:
 * ```plain
 * a, b, c, d, e, f, g, h, i,  ,  , l, m, n, o, p,  , r, s, t, u,  ,  , x,  ,  ,
 *  ,  , C,  , E,  ,  ,  , I,  ,  ,  ,  , N, O,  ,  , R, S,  ,  ,  ,  ,  ,  ,  ,
 * \, {, }, (, ), [, ]
 * <SPACE>
 * ```
 */
export function generateMap(options: ResolvedOptions): Map<string, string> {
	const map = options.map;

	const n_0 = smartNumber(0, options);
	const n_1 = smartNumber(1, options);
	const n_2 = smartNumber(2, options);
	const n_3 = smartNumber(3, options);
	const n_4 = smartNumber(4, options);
	const n_5 = smartNumber(5, options);
	const n_6 = smartNumber(6, options);
	const n_7 = smartNumber(7, options);
	const n_9 = smartNumber(9, options);
	const n_13 = smartNumber(13, options);
	const n_14 = smartNumber(14, options);
	const n_17 = smartNumber(17, options);
	const n_18 = smartNumber(18, options);
	const n_22 = smartNumber(22, options);
	const n_23 = smartNumber(23, options);

	setFrom(getNaN(options), "NaN", options);
	setFrom(getObject(options), "[object Object]", options);
	setFrom(getBool(false, options), "false", options);
	setFrom(getBool(true, options), "true", options);
	setFrom(getInfinity(options), "Infinity", options);
	setFrom(
		getStringConstructor(options),
		"function String() { [native code] }",
		options
	);
	setFrom(
		getRegexConstructor(options),
		"function RegExp() { [native code] }",
		options
	);

	map.set("\\", `(/\\\\/+[])[${n_1}]`);
	map.set("d", `(${n_13})[${fromString("toString", options)}](${n_14})`);
	map.set("h", `(${n_17})[${fromString("toString", options)}](${n_18})`);
	map.set("m", `(${n_22})[${fromString("toString", options)}](${n_23})`);
	map.set(
		"C",
		`((()=>{})[${fromString("constructor", options)}](${fromString(
			"return escape",
			options
		)})()(${map.get("\\")}))[${n_2}]`
	);

	setFrom(
		getArrayConstructor(options),
		"function Array() { [native code] }",
		options
	);

	return map;
}
