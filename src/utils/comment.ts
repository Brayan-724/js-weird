import { OptionLevels, ResolvedOptions } from "@/types";

export function comment(
	option: keyof OptionLevels,
	text: string,
	options: ResolvedOptions
): string {
	if (options.levels[option].comment) return `/* ${text} */`;
	return "";
}

export function commentCode(
	option: keyof OptionLevels,
	text: string,
	code: string,
	options: ResolvedOptions
): string {
	if (options.levels[option].comment) return `/* ${text} */ ${code}`;
	return code;
}
