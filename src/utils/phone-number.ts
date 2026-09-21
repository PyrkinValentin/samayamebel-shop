import type { CountryCode, FormatNumberOptions, NumberFormat } from "libphonenumber-js"

import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js"

type InputPhoneNumberOptions = CountryCode | {
	defaultCountry?: CountryCode
	defaultCallingCode?: string
}

export const formatPhoneNumber = (
	value: string | undefined,
	format: NumberFormat,
	options?: FormatNumberOptions
) => (
	value
		? parsePhoneNumberFromString(value)?.format(format, options)
		: undefined
)

export const inputPhoneNumber = (value: string, options?: InputPhoneNumberOptions) => {
	return new AsYouType(options).input(
		value
			? `+${value.replace(/\D/g, "")}`
			: ""
	)
}