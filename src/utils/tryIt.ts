export type Func<A extends Array<any> = any[], R = any> = (
	...args: A
) => R | { (...args: A): R };
export type Parameters<F extends Func> = F extends (...args: infer P) => any
	? P
	: never;
export type ReturnType<F extends Func> = F extends (...args: any[]) => infer R
	? R
	: never;

type TryItRes<O extends boolean, E extends Error, T> = O extends true
	? { error: E; value: undefined } | { error: undefined; value: T }
	: [E, undefined] | [undefined, T];

type TryItRet<O extends boolean, E extends Error, F> = F extends Promise<
	infer T
>
	? Promise<TryItRes<O, E, T>>
	: F extends Func<any[], infer R>
	? R extends Promise<infer T>
		? Promise<TryItRes<O, E, T>>
		: TryItRes<O, E, ReturnType<F>>
	: TryItRes<O, E, unknown>;

/**
 * Try to execute a function and return an array with error or result.
 * @param fn Function to try
 * @param args Arguments to pass to function
 */
export function tryIt<O extends boolean, E extends Error, F extends Func>(
	obj: O,
	fn: F,
	...args: Parameters<F>
): TryItRet<O, E, F>;

/**
 * Try to execute a function and return an array with error or result.
 * @param fn Function to try
 * @param args Arguments to pass to function
 */
export function tryIt<
	O extends boolean,
	E extends Error,
	F extends Promise<any>
>(obj: O, fn: F): TryItRet<O, E, F>;

export function tryIt<
	O extends boolean,
	E extends Error,
	F extends Func | Promise<any>
>(
	obj: O,
	fn: F,
	...args: F extends Func ? Parameters<F> : []
): TryItRet<O, E, F> {
	function ret(error: E | undefined, value?: any): TryItRet<O, E, F> {
		if (obj) {
			if (error) return { error, value: undefined } as TryItRet<O, E, F>;
			return { error: undefined, value } as TryItRet<O, E, F>;
		}

		return [error, value] as TryItRet<O, E, F>;
	}
	function promise(promise: Promise<any>): TryItRet<O, E, F> {
		return promise
			.then((value) => ret(undefined, value))
			.catch((error) => ret(error)) as TryItRet<O, E, F>;
	}

	if (fn instanceof Promise) {
		return promise(fn);
	}

	if (typeof fn === "function") {
		try {
			const r = fn(...args);

			if (r instanceof Promise) {
				return promise(r);
			}

			return ret(undefined, r);
		} catch (e) {
			return ret(e as E);
		}
	}

	return ret(new Error("Not a function or Promise") as E);
}
