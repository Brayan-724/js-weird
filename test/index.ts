import { compile } from "@";
import { parseNumber } from "@/parse";
import { smartNumber } from "@parser/smartNumber";

console.log(compile("C"))

// for (let i = 0; i <= 500; i += 10) {
// 	const v = smartNumber(i, true);
// 	const v2 = parseNumber(i, true);
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
