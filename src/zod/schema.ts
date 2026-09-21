import { isValidPhoneNumber } from "libphonenumber-js"
import { pluralize } from "@/utils"
import { z } from "./zod"

import {
	ATTRIBUTE_NAME_MAX_LENGTH,
	ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH,
	ATTRIBUTE_OPTION_NAME_MAX_LENGTH,
	ATTRIBUTE_TYPES,
	AUTH_OTP_LENGTH,
	PHONE_NUMBER_MAX_LENGTH, UNIT_NAME_MAX_LENGTH,
	UNIT_SHORT_NAME_MAX_LENGTH,
	USER_NAME_MAX_LENGTH,
} from "@/constants"

const ONLY_DIGITS_REGEX = /^\d+$/

export const Z = {
	id: z
		.number("ID должен быть числом")
		.int("ID должен быть целым числом")
		.min(0, "ID не может быть отрицательным числом"),
	uuid: z.uuid("Некорректный UUID"),
	username: z
		.string("Имя должно быть строкой")
		.trim()
		.min(1, "Введите имя")
		.min(2, "Слишком короткое имя")
		.max(USER_NAME_MAX_LENGTH, `Имя не должно превышать ${USER_NAME_MAX_LENGTH} ${pluralize(USER_NAME_MAX_LENGTH, "symbol")}`),
	phoneNumber: z
		.string("Номер телефона должен быть строкой")
		.trim()
		.min(1, "Введите номер телефона")
		.max(PHONE_NUMBER_MAX_LENGTH, `Номер телефона не должен превышать ${PHONE_NUMBER_MAX_LENGTH} ${pluralize(PHONE_NUMBER_MAX_LENGTH, "symbol")}`)
		.refine(isValidPhoneNumber, { message: "Некорректный номер или код страны" }),
	code: z
		.string("Код должен быть строкой")
		.trim()
		.min(1, "Введите код из смс")
		.length(AUTH_OTP_LENGTH, `Код должен состоять из ${AUTH_OTP_LENGTH} ${pluralize(AUTH_OTP_LENGTH, "symbol")}`)
		.regex(ONLY_DIGITS_REGEX, "Код должен содержать только цифры"),
	sortOrder: z
		.number("Порядок сортировки должен быть числом")
		.int("Порядок сортировки должен быть целым числом")
		.min(0, "Порядок сортировки не может быть меньше 0"),
	attribute: {
		type: z.enum(ATTRIBUTE_TYPES, "Выберите тип данных"),
		name: z
			.string("Наименование должно быть строкой")
			.trim()
			.min(1, "Введите наименование")
			.min(2, "Слишком короткое наименование")
			.max(ATTRIBUTE_NAME_MAX_LENGTH, `Наименование не должно превышать ${ATTRIBUTE_NAME_MAX_LENGTH} ${pluralize(ATTRIBUTE_NAME_MAX_LENGTH, "symbol")}`),
	},
	attributeOption: {
		name: z
			.string("Значение должно быть строкой")
			.trim()
			.min(1, "Введите значение")
			.max(ATTRIBUTE_OPTION_NAME_MAX_LENGTH, `Значение не должно превышать ${ATTRIBUTE_OPTION_NAME_MAX_LENGTH} ${pluralize(ATTRIBUTE_OPTION_NAME_MAX_LENGTH, "symbol")}`),
		description: z
			.string("Описание должно быть строкой")
			.trim()
			.max(ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH, `Описание не должно превышать ${ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH} ${pluralize(ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH, "symbol")}`)
			.transform((value) => value.trim() === "" ? null : value)
			.nullable(),
	},
	unit: {
		shortName: z
			.string("Краткое наименование должно быть строкой")
			.trim()
			.min(1, "Введите краткое наименование")
			.max(UNIT_SHORT_NAME_MAX_LENGTH, `Краткое наименование не должно превышать ${UNIT_SHORT_NAME_MAX_LENGTH} ${pluralize(UNIT_SHORT_NAME_MAX_LENGTH, "symbol")}`),
		name: z
			.string("Наименование должно быть строкой")
			.trim()
			.min(1, "Введите наименование")
			.max(UNIT_NAME_MAX_LENGTH, `Наименование не должно превышать ${UNIT_NAME_MAX_LENGTH} ${pluralize(UNIT_NAME_MAX_LENGTH, "symbol")}`),
	},
}