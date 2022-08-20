import { format } from "util";

const debugRegex = /^--debug=?/;
const debugString: string | undefined = process.argv.find((arg) =>
	debugRegex.test(arg)
);
export const canDebug = debugString !== undefined;
const _debugKeys = canDebug ? debugString!.replace(debugRegex, "") : "";
const debugKeys = canDebug
	? _debugKeys.length === 0
		? []
		: _debugKeys.split(",").map((key) => key.toUpperCase())
	: [];
const isSpecific = debugKeys.length > 0;

export function debugLog(key: string, ...args: any[]) {
	if (!canDebug) return;
	if (isSpecific && !debugKeys.includes(key.toUpperCase())) return;
	console.log(`\x1b[46m ${key.toUpperCase()} \x1b[0m`, ...args);
}
