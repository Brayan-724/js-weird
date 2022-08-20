#!/bin/env node

import { readFileSync } from "fs";
import { Options } from "./types";
import { debugLog } from "./utils/debug";
import { mergeDeep } from "./utils/mergeDeep";
import { tryIt } from "./utils/tryIt";

type RawArg<V, H extends boolean = boolean> = H extends true
	? {
			has: H;
			name: string;
			value: V;
	  }
	: { has: H; name: string };

type RawStringArg<H extends boolean = boolean> = RawArg<string, H>;
type RawBooleanArg<H extends boolean = boolean> = RawArg<boolean, H>;

function sendError(error: Error): never {
	console.error("\x1b[31mError\x1b[0m", error.message);
	process.exit(1);
}

function getArg(
	usage: string,
	name: string,
	alias?: string
): RawArg<string | undefined> {
	{
		const value = process.argv
			.slice(2)
			.find((arg) => arg.startsWith(`--${name}`));
		if (value) {
			const [, value_] = value.split("=");
			return { has: true, name, value: value_ };
		}
	}

	alias: {
		if (!alias) break alias;
		const value = process.argv
			.slice(2)
			.find((arg) => arg.startsWith(`-${alias}`));
		if (value) {
			const [, value_] = value.split("=");
			return { has: true, name, value: value_! };
		}
	}

	return { has: false, name };
}

function getStringArg(
	usage: string,
	name: string,
	alias?: string
): RawStringArg {
	const arg = getArg(usage, name, alias);
	if (arg.has) {
		if (!arg.value) sendError(new Error(`${name} has no value`));

		return arg as RawStringArg;
	}

	return { has: false, name };
}

function getBooleanArg(
	usage: string,
	name: string,
	alias?: string
): RawBooleanArg {
	const arg = getArg(usage, name, alias);
	if (arg.has) {
		if (!arg.value) return { has: true, name, value: true };

		if (arg.value === "true") return { has: true, name, value: true };
		if (arg.value === "false") return { has: true, name, value: false };

		sendError(
			new Error(`${name} has invalid value (only "true", "false", or nothing)`)
		);
	}

	return { has: false, name };
}

const customConfig: Options = {};
const configStrictLevels = ["literal", "strict", "stored"];
//#region Config
{
	function setConfigArg(
		name: string,
		path: string[],
		type: "string" | "boolean"
	): void {
		const arg =
			type === "string" ? getStringArg("", name) : getBooleanArg("", name);

		if (arg.has) {
			if (
				type === "string" &&
				!configStrictLevels.includes(arg.value as string)
			) {
				sendError(
					new Error(
						`${name} has invalid value (only ${configStrictLevels.join(", ")})`
					)
				);
			}
			deepSetter(customConfig, path, arg.value);
		}
	}

	function setLevelArg(name: string) {
		setConfigArg(name + ".comment", ["levels", name, "comment"], "boolean");
		setConfigArg(name + ".level", ["levels", name, "level"], "string");
	}

	setConfigArg("minify", ["minify"], "boolean");
	setConfigArg("ofuscate", ["ofuscate"], "boolean");
	setConfigArg("autoRun", ["autoRun"], "boolean");
	setLevelArg("number");
}
//#endregion

const configArg = getStringArg("Set config file", "config", "c");

async function main() {
	const config = (() => {
		let config: Options = {};
		if (configArg.has) {
			debugLog("CONFIG", "Loading config:", configArg.value);
			let file_ = tryIt(true, () => readFileSync(configArg.value, "utf8"));

			if (file_.error) {
				sendError(new Error(`Cannot read config file: ${configArg.value}`));
			}

			let file = file_.value;
			let config_ = tryIt(true, (): Options => JSON.parse(file));

			if (config_.error) {
				sendError(new Error(`Cannot parse config file: ${configArg.value}`));
			}

			config = config_.value;
			debugLog("CONFIG", "Loaded");
		}

		return mergeDeep(config, customConfig) as Options;
	})();

	console.log(config);
}

function deepSetter<O>(obj: O, path: string[], value: any): void {
	if (path.length === 1) {
		// @ts-ignore
		obj[path[0]] = value;
		return;
	}

	// @ts-ignore
	if (!obj[path[0]]) {
		// @ts-ignore
		obj[path[0]] = {};
	}

	// @ts-ignore
	deepSetter(obj[path[0]], path.slice(1), value);
}

main();
