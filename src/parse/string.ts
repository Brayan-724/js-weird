import { ExprStrictLevel, ResolvedOptions } from "@/types";
import { commentCode } from "@/utils/comment";
import { VariableManager } from "@/variable";
import { smartNumber } from "./smartNumber";
import { getStringConstructor } from "./values";

export function fromString(
	s: string,
	options: ResolvedOptions,
	m: boolean = false
): string {
	if (options.levels.string.level === ExprStrictLevel.Literal) return s;

	const isStored = options.levels.string.level === ExprStrictLevel.Stored;

	if (!m && isStored && VariableManager.stringManager.has(s)) {
		const varName = VariableManager.stringManager.get(s)!.name;
		return varName;
	}

	const str = s
		.split("")
		.map((x): string => {
			if (!options.map.has(x)) {
				const charCode = x.charCodeAt(0);
				return `${getStringConstructor(options)}[${fromString(
					"fromCharCode",
					options
				)}](${smartNumber(charCode, options)})`;
			}
			return options.map.get(x)!;
		})
		.join("+");

	if (m) {
		return str;
	}

	if (isStored) {
		return VariableManager.stringManager.add(s, (varname: string) =>
			commentCode(
				"string",
				`Value: "${s}"`,
				`const ${varname} = ${str};`,
				options
			)
		);
	} else {
		return commentCode("string", `Value: "${s}"`, str, options);
	}
}
