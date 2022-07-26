import { parseNumber } from "@parser/number";

const zero = "![]";
const one = "!![]";

function _parse(...ns: (number | string)[]): string[] {
	return ns.map((e) => {
		if (typeof e === "number") return `(${parseNumber(e, true)})`;
		if (typeof e === "string") return `(${e})`;

		throw new TypeError(
			"'Param' should be number or string instead of " + typeof e
		);
	});
}

function makeOperator(op: string) {
	return (...values: (number | string)[]): string => {
		const parsed = _parse(...values);
		return `${parsed.join(` ${op} `)}`;
	};
}

const _add = makeOperator("+");
const _mult = makeOperator("*");
const _pow = makeOperator("**");

export function add(...values: (number | string)[]): string {
	return _add(...values);
}

export function mult(...values: (number | string)[]): string {
	return _mult(...values);
}

export function pow(...values: (number | string)[]): string {
	return _pow(...values);
}
