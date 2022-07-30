export type Func<A extends Array<any> = any[], R = any> = (...args: A) => R;
type PromiseValue<T extends Promise<any>> = T extends Promise<infer U>
	? U
	: never;

type TryItRes<E extends Error, T> = [E, undefined] | [undefined, T];
type TryItRet<E extends Error, F extends Func | Promise<any>> = F extends Func<
	any[],
	infer R
>
	? R extends Promise<infer T>
		? Promise<TryItRes<E, T>>
		: TryItRes<E, R>
	: F extends Promise<infer T>
	? Promise<TryItRes<E, T>>
	: TryItRes<E, undefined>;

/**
 * Try to execute a function and return an array with error or result.
 * @param fn Function to try
 * @param args Arguments to pass to function
 */
export function tryIt<E extends Error, F extends Func>(
	fn: F,
	...args: Parameters<F>
): TryItRet<E, ReturnType<F>>;

/**
 * Try to execute a function and return an array with error or result.
 * @param fn Function to try
 * @param args Arguments to pass to function
 */
export function tryIt<E extends Error, F extends Func<any[], Promise<any>>>(
	fn: F,
	...args: Parameters<F>
): Promise<TryItRet<E, PromiseValue<ReturnType<F>>>>;

/**
 * Try to execute a function and return an array with error or result.
 * @param fn Function to try
 * @param args Arguments to pass to function
 */
export function tryIt<E extends Error, F extends Promise<any>>(
	fn: F
): Promise<TryItRet<E, PromiseValue<F>>>;

export function tryIt<E extends Error, F extends Func | Promise<any>>(
	fn: F,
	...args: F extends Func ? Parameters<F> : []
): TryItRet<E, F> {
	if (fn instanceof Promise) {
		return fn.then((v) => [, v]).catch((e) => [e]) as TryItRet<E, F>;
	}

	if (typeof fn === "function") {
		try {
			const r = fn(...args);

			if (r instanceof Promise) {
				return r.then((v) => [, v]).catch((e) => [e]) as TryItRet<E, F>;
			}

			return [undefined, r] as TryItRet<E, F>;
		} catch (e) {
			return [e as E, undefined] as TryItRet<E, F>;
		}
	}

	return [new Error("Not a function or Promise"), undefined] as TryItRet<E, F>;
}
