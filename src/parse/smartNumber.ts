import { parseNumber } from "./number";
import { add, mult, pow } from "../utis/math";
// const math = require("./math");
// const rr = require("../util/minifier");

export function smartNumber(
	n: number,
	isStrict: boolean = true,
	minify: boolean = true
): string {
	if (typeof n === "string") n = parseInt(n, 10);
	else if (typeof n !== "number")
		throw new TypeError(
			"Number param should be number :/ instead of " + typeof n
		);

	if (!isStrict) return n.toString?.() || `${n}`;

	const absN = Math.abs(n);
	const negative = n < 0;

	if (absN <= 5) return parseNumber(n, true, minify);

	if (n % 2 === 0) return mult(smartNumber(absN / 2, true, minify), 2);
	else if (Math.sqrt(absN) % 1 === 0)
		return pow(smartNumber(Math.sqrt(absN), true, minify), 2);
	else return add(mult(smartNumber((absN / 2) | 0, true, minify), 2), 1);
}
