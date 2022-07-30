import { RequiredDeep } from "./util";

export enum ExprStrictLevel {
	/**
	 * Direct literal expression
	 */
	Literal,

	/**
	 * Store expression in a variable
	 */
	Stored,

	/**
	 * Just use arrays
	 */
	Strict,
}

export interface ExprOptions {
	/**
	 * Put a comment before the expression with the original value
	 * @default false
	 */
	comment?: boolean;
	/**
	 * Strict mode
	 *
	 * @default Stored
	 * @see {@link ExprStrictLevel.Stored}
	 */
	level?: ExprStrictLevel;
}

export interface OptionLevels {
	string?: ExprOptions;
	number?: ExprOptions;
	values?: ExprOptions;
}

export interface Options {
	/**
	 * If should minify the output.
	 * @default true
	 *
	 * @see true: [uglify-js](https://www.npmjs.com/package/uglify-js)
	 * @see false: [prettier](https://www.npmjs.com/package/prettier)
	 */
	minify?: boolean;

	/**
	 * If can use minified names for literals
	 */
	ofuscate?: boolean;

	/**
	 * Strict level
	 */
	levels?: OptionLevels;

	/**
	 * Use an auto called function
	 */
	autoRun?: boolean;
}

export type ResolvedOptions = RequiredDeep<Options> & {
	/**
	 * Chars: a, b, c, C, d, e, f, g, h, i, m, n, o, O, p, r, s, S, t, u, \
	 */
	map: Map<string, string>;
};
