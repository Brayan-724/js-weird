import { expect } from "chai";
import { ExprStrictLevel, ResolvedOptions } from "@/types";
import { resolveOptions } from "@/utils/config";
import { smartNumber } from "./smartNumber";
import { debugLog } from "@/utils/debug";

describe("SmartNumber Unit", () => {
	const options: ResolvedOptions = resolveOptions({
		levels: {
			number: {
				level: ExprStrictLevel.Strict,
			},
		},
	});

	it("without errors", () => {
		debugLog("smartNumber unit", "Unit - without errors");
		for (let i = 0; i <= 500; i += 10) {
			const v = smartNumber(i, options);
			let val: Error | number;

			try {
				val = eval(v);
			} catch (e) {
				val = e;
			}

			expect(val).to.equal(i);

			debugLog(
				"smartNumber unit",
				v,
				"=",
				val instanceof Error ? "Error" : val,
				val === i ? "==" : "!=",
				i
			);
		}
	});
});
