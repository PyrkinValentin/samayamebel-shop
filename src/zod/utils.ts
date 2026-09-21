import type { Errors } from "@/types"

import { z } from "./zod"

export const validateSchema = <T>(
	schema: z.ZodType<T>,
	values: unknown,
) => {
	const { success, error, data } = schema.safeParse(values)

	if (!success) {
		const errors: Errors = {}

		error.issues.forEach((issue) => {
			const path = issue.path.length > 0
				? issue.path.join(".")
				: "root"

			if (!errors[path]) {
				errors[path] = issue.message
			}
		})

		return { errors }
	}

	return { values: data }
}

export const combineErrorsSchema = (errors: Errors): string => {
	return Array
		.from(new Set(Object.values(errors)))
		.join(", ")
}