import { parseNumber } from "./number";
import { add, mult, pow } from "../utils/math";
import { ExprStrictLevel, ResolvedOptions } from "../types";
import { VariableManager } from "../variable";

export function smartNumber(n: number, options: ResolvedOptions): string {
	const option = options.levels.number;
	if (option.level === ExprStrictLevel.Literal) return n.toString?.() || `${n}`;

	const isStoredLevel = option.level === ExprStrictLevel.Stored;

	if (isStoredLevel && VariableManager.numberManager.has(n)) {
		const varName = VariableManager.numberManager.get(n)!.name;
		return varName;
	}

	const absN = Math.abs(n);
	const negative = n < 0;

	function R(r: string): string {
		return VariableManager.numberManager.add(n, r);
	}

	if (absN <= 5) return R(parseNumber(n));

	if (n % 2 === 0) return R(mult(smartNumber(absN / 2, options), 2));
	else if (Math.sqrt(absN) % 1 === 0)
		return R(pow(smartNumber(Math.sqrt(absN), options), 2));
	else return R(add(mult(smartNumber((absN / 2) | 0, options), 2), 1));
}
