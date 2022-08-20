import { expect } from "chai";
import { ExprStrictLevel, ResolvedOptions } from "@/types";
import { resolveOptions } from "@/utils/config";
import { parseNumber } from "./number";
import { debugLog } from "@/utils/debug";

describe("ParseNumber Unit", () => {
	const options: ResolvedOptions = resolveOptions({
		levels: {
			number: {
				level: ExprStrictLevel.Strict,
			},
		},
	});

	it("without errors", () => {
		debugLog("parseNumber - without errors");
		for (let i = 0; i <= 500; i += 10) {
			const v = parseNumber(i, options);
			let val: Error | number;

			try {
				val = eval(v);
			} catch (e) {
				val = e;
			}

			expect(val).to.equal(i);

			debugLog(
				v,
				"=",
				val instanceof Error ? "Error" : val,
				val === i ? "==" : "!=",
				i
			);
		}
	});
});
