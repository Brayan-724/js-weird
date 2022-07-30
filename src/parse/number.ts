/**
 * Already parsed number
 * @see {@link parseNumber}
 */
export const zero = "+[]";

/**
 * Already parsed number
 * @see {@link parseNumber}
 */
export const one = "+!![]";

function getN(n: number, minify: boolean = true) {
	return [one, ...new Array(n - 1).fill(one)];
}

/**
 * Transform a number to a string with weird javascript syntax
 * @param n Number target
 * @param isStrict If can use literal numbers or just arrays
 * @param minify If should minify the output
 * @returns Number in string format
 */
export function parseNumber(
	n: number,
	isStrict: boolean = true,
	minify: boolean = true
) {
	if (!isStrict) return n.toString?.() || `${n}`;

	const absN = Math.abs(n);
	const negative = n < 0;
	let str: string[];

	if (absN === 0) str = [zero];
	else if (absN === 1) str = [one];
	else str = getN(absN, minify);

	const s = str.join("");

	return negative ? `-(${s})` : `${s}`;
}
