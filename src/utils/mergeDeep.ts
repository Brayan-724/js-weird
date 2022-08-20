import { isObject } from "./isObject";

/**
 * Deep merge two objects.
 */
export function mergeDeep<A, T>(target: A, source: T): A & T {
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				// @ts-ignore
				if (!target[key]) Object.assign(target, { [key]: {} });
				// @ts-ignore
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return target as A & T;
}
