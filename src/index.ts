import { parseNumber } from "./parse";
import { smartNumber } from "./parse/smartNumber";

const zero = "+[]";
const one = "+!![]";

// C

export const map: Record<string, string> = {};

const fromString = (s: string) =>
	s
		.split("")
		.map((x): string => {
			if (!(x in map)) {
				const charCode = x.charCodeAt(0);
				return `([]+[])[${fromString("constructor")}][${fromString(
					"fromCharCode"
				)}](${parseNumber(charCode)})`;
			}
			return map[x]!;
		})
		.join("+");

map["a"] = `(+{}+[])[${smartNumber(1)}]`;
map["b"] = `({}+[])[${smartNumber(2)}]`;
map["o"] = `({}+[])[${smartNumber(1)}]`;
map["e"] = `({}+[])[${smartNumber(4)}]`;
map["c"] = `({}+[])[${smartNumber(5)}]`;
map["t"] = `({}+[])[${smartNumber(6)}]`;
map[" "] = `({}+[])[${smartNumber(7)}]`;
map["f"] = `(![]+[])[${smartNumber(0)}]`;
map["s"] = `(![]+[])[${smartNumber(3)}]`;
map["r"] = `(!![]+[])[${smartNumber(1)}]`;
map["u"] = `(!![]+[])[${smartNumber(2)}]`;
map["i"] = `((+!![]/+[])+[])[${smartNumber(3)}]`;
map["n"] = `((+!![]/+[])+[])[${smartNumber(4)}]`;
map["S"] = `([]+([]+[])[${fromString("constructor")}])[${smartNumber(9)}]`;
map["g"] = `([]+([]+[])[${fromString("constructor")}])[${smartNumber(14)}]`;
map["p"] = `([]+(/-/)[${fromString("constructor")}])[${smartNumber(14)}]`;
map["\\"] = `(/\\\\/+[])[${smartNumber(1)}]`;
map["d"] = `(${smartNumber(13)})[${fromString("toString")}](${smartNumber(
	14
)})`;
map["h"] = `(${smartNumber(17)})[${fromString("toString")}](${smartNumber(
	18
)})`;
map["m"] = `(${smartNumber(22)})[${fromString("toString")}](${smartNumber(
	23
)})`;
map["C"] = `((()=>{})[${fromString("constructor")}](${fromString(
	"return escape"
)})()(${map["\\"]}))[${smartNumber(2)}]`;

export enum ExprStrictLevel {
  /**
   * Direct literal expression
   */
	Literal,

  /**
   * Store expression in a variable
   */
	Stored,

  /**
   * Just use arrays
   */
	Strict,
}

export interface OptionLevels {
  string?: ExprStrictLevel;
  number?: ExprStrictLevel;
} 

export interface Options {
	/**
	 * If should minify the output
	 */
	minify?: boolean;

	/**
	 * If can use minified names for literals
	 */
	ofuscate?: boolean;

	/**
	 * Strict level
	 */
	levels?: OptionLevels;

	/**
	 * Use an auto called function
	 */
	autoRun?: boolean;
}

export const compile = (code: string, options?: Options) =>
	`(()=>{})[${fromString("constructor")}](${fromString(code)})()`;
