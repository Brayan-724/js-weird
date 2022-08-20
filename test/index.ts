import { compile } from "@";
import { parseNumber } from "@/parse";
import { ExprStrictLevel, ResolvedOptions } from "@/types";
import { resolveOptions } from "@/utils/config";
import { smartNumber } from "@parser/smartNumber";

compile(String.raw`
function a() { return [...arguments] };
console.log(...a("hola", ":)"))
`, {
	minify: false,
  ofuscate: false,
	levels: {
		number: {
			comment: true,
		},
		string: {
			comment: true
		},
		values: {
			comment: true
		}
	},
	autoRun: true
})
	.then(console.log)
	.catch(console.error);

// const options: ResolvedOptions = resolveOptions({
// 	levels: {
// 		number: {
// 			level: ExprStrictLevel.Strict
// 		}
// 	}
// });

// for (let i = 0; i <= 500; i += 10) {
// 	const v = smartNumber(i, options);
// 	const v2 = parseNumber(i);
// 	let val: Error | number;
// 	let val2: Error | number;

// 	try {
// 		val = eval(v);
// 	} catch (e) {
// 		val = e;
// 	}

// 	try {
// 		val2 = eval(v2);
// 	} catch (e) {
// 		val2 = e;
// 	}

// 	console.log(i);
// 	console.log(v, "=", val instanceof Error ? "Error" : val);
// 	console.log(v2, "=", val2 instanceof Error ? "Error" : val2);
// }

// describe("smartNumber")
