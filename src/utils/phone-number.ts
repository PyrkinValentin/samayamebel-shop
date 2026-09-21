import type { FormatNumberOptions, NumberFormat } from "libphonenumber-js"

import { parsePhoneNumberFromString } from "libphonenumber-js"

export const formatPhoneNumber = (
	value: string | undefined,
	format: NumberFormat,
	options?: FormatNumberOptions
) => (
	value
		? parsePhoneNumberFromString(value)?.format(format, options)
		: undefined
)