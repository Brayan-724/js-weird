/**
 * Simple object check.
 */
export function isObject(item: any): item is Record<any, any> & object {
	return item && typeof item === "object" && !Array.isArray(item);
}
