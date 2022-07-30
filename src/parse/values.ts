import { ExprStrictLevel, ResolvedOptions } from "@/types";
import { VariableManager } from "@/variable";
import { fromString } from "./string";

function factory(key: string, value: string, options: ResolvedOptions): string {
  
  if (options.levels.values.level === ExprStrictLevel.Strict) return value;

  if (VariableManager.valuesManager.has(key)) {
    return VariableManager.valuesManager.get(key)!.name;
  }

  return VariableManager.valuesManager.add(key, value);
}

export function getObject(options: ResolvedOptions): string {
  return factory("obj", "{}+[]", options);
}

export function getNaN(options: ResolvedOptions): string {
  return factory("nan", "+{}+[]", options);
}

export function getBool(bool: boolean, options: ResolvedOptions): string {
  return factory(bool ? "true" : "false", bool ? "!![]+[]" : "![]+[]", options);
}

export function getInfinity(options: ResolvedOptions): string {
  return factory("inf", "(+!![]/+[])+[]", options);
}

export function getString(options: ResolvedOptions): string {
  return factory("str", "[]+[]", options);
}

export function getConstructorFrom(val: string, options: ResolvedOptions): string {
  return `[]+(${val})[${fromString("constructor", options)}]`
}

export function getRegexConstructor(options: ResolvedOptions): string {
  return factory("regex", getConstructorFrom("/-/", options), options);
}

export function getStringConstructor(options: ResolvedOptions): string {
  return factory("str_cons", getConstructorFrom(getString(options), options), options);
}

export function getArrayConstructor(options: ResolvedOptions): string {
  return factory("arr", getConstructorFrom("[]", options), options);
}