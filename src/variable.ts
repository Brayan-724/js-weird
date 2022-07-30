import { ResolvedOptions } from "./types";

const variablePrefixes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class VariableManager<K> {
	static readonly variables: Map<string, Variable> = new Map();
	static readonly order: Set<string> = new Set();

	static readonly numberManager = new VariableManager<number>("num", 0);
	static readonly stringManager = new VariableManager<string>("str", 1);
	static readonly valuesManager = new VariableManager<string>("val", 2);

	private readonly variables: Map<K, Variable> = new Map();
	private readonly names: Set<string> = new Set();
	private readonly order: Set<K> = new Set();
	private usedPrefix: string = this.prefix;
	private options!: ResolvedOptions;

	constructor(readonly prefix: string, readonly index: number) {
		if (index >= variablePrefixes.length) {
			throw new Error(`Too many variable managers!`);
		}
	}

	public getOrder(): K[] {
		return [...this.order].reverse();
	}

	public get(key: K): Variable {
		return this.variables.get(key)!;
	}

	public set(key: K, value: Variable): void {
		this.variables.set(key, value);
	}

	public has(key: K): boolean {
		return this.variables.has(key);
	}

	/**
	 * @param key The key of the variable to get the name of
	 * @param declaration A function for generating the declaration of the variable
	 * @returns The name of the variable
	 */
	public add(key: K, declaration: (varname: string) => string): string;

	/**
	 * @param key The key of the variable to get the name of
	 * @param value The value of the variable, auto-generated declaration
	 * @returns The name of the variable
	 */
	public add(key: K, value: string): string;

	public add(
		key: K,
		valOrDecl: string | ((varname: string) => string)
	): string {
		const varname = this.generateName(key);
		const declaration =
			typeof valOrDecl === "function"
				? valOrDecl(varname)
				: `const ${varname} = ${valOrDecl};`;
		this.names.add(varname);
		this.order.add(key);
		this.variables.set(key, new Variable(varname, declaration));

		VariableManager.order.add(varname);
		VariableManager.variables.set(varname, new Variable(varname, declaration));

		return varname;
	}

	public generateName<G>(key: G): string {
		if (this.options.ofuscate) {
			const clean = Date.now().toString(32).substring(2);
			let varname = clean;
			let exists = this.names.has(`${this.usedPrefix}_${varname}`);
			let attempts = 0;

			while (exists) {
				// console.log(clean, varname)
				varname = `${clean}_${++attempts}`;
				exists = this.names.has(`${this.usedPrefix}_${varname}`);
			}

			return `${this.usedPrefix}_${varname}`;
		}

		if (typeof key === "string") {
			const clean = VariableManager.cleanName(key);
			let varname = clean;
			let exists = this.names.has(clean);
			let attempts = 0;

			while (exists) {
				varname = `${clean}_${++attempts}`;
				exists = this.names.has(varname);
			}

			return `${this.usedPrefix}_${varname}`;
		}

		if (typeof key === "object") {
			return this.generateName(JSON.stringify(key));
		}

		if (typeof key === "number") {
			const abs = Math.abs(key);
			const isNegative = key < 0;
			return this.generateName(`${isNegative ? "N" : ""}${abs}`);
		}

		return this.generateName(`${key}`);
	}

	public reset(options: ResolvedOptions): void {
		this.options = options;
		this.usedPrefix = options.ofuscate
			? variablePrefixes[this.index]!
			: this.prefix;

		this.variables.clear();
		this.names.clear();
		this.order.clear();
	}

	private static cleanName(name: string): string {
		return name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_{2,}/g, "_");
	}

	static get(name: string): Variable {
		return VariableManager.variables.get(name)!;
	}

	static getOrder(): string[] {
		return [...VariableManager.order].reverse();
	}

	static reset(options: ResolvedOptions) {
		VariableManager.variables.clear();
		VariableManager.order.clear();
		VariableManager.numberManager.reset(options);
		VariableManager.stringManager.reset(options);
		VariableManager.valuesManager.reset(options);
	}
}

export class Variable {
	constructor(readonly name: string, readonly declaration: string) {}
}
