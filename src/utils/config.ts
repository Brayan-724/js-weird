import { ExprStrictLevel, Options, ResolvedOptions } from "../types/lib";

export function resolveOptions(options: Options): ResolvedOptions {
	return Object.assign(
		<ResolvedOptions>{
			minify: true,
			ofuscate: false,
			levels: {
				string: {
					comment: false,
					level: ExprStrictLevel.Stored,
				},
				number: {
					comment: false,
					level: ExprStrictLevel.Stored,
				},
				values: {
					comment: false,
					level: ExprStrictLevel.Stored,
				},
			},
			autoRun: true,
			map: new Map<string, string>()
		},
		options
	) as ResolvedOptions;
}
