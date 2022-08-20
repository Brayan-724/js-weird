import { smartNumber } from "@/parse";
import { ResolvedOptions } from "@/types";
// import { parseNumber } from "@parser/number";

const zero = "![]";
const one = "!![]";

function _parse(
	options: ResolvedOptions,
	...ns: (number | string)[]
): string[] {
	return ns.map((e) => {
		if (typeof e === "number") return `(${smartNumber(e, options)})`;
		if (typeof e === "string") return `(${e})`;

		throw new TypeError(
			"'Param' should be number or string instead of " + typeof e
		);
	});
}

function makeOperator(op: string) {
	return (options: ResolvedOptions, ...values: (number | string)[]): string => {
		const parsed = _parse(options, ...values);
		return `${parsed.join(`${op}`)}`;
	};
}

const _add = makeOperator("+");
const _mult = makeOperator("*");
const _pow = makeOperator("**");

export function add(
	options: ResolvedOptions,
	...values: (number | string)[]
): string {
	return _add(options, ...values);
}

export function mult(
	options: ResolvedOptions,
	...values: (number | string)[]
): string {
	return _mult(options, ...values);
}

export function pow(
	options: ResolvedOptions,
	...values: (number | string)[]
): string {
	return _pow(options, ...values);
}
