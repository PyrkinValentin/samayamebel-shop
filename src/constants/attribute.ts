import type { AttributeType } from "@/types"

type AttributeTypeMeta = {
	id: number
	value: AttributeType
	label: string
	description: string
}

export const ATTRIBUTE_NAME_MAX_LENGTH = 255
export const ATTRIBUTE_OPTION_NAME_MAX_LENGTH = 255
export const ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH = 255
export const ATTRIBUTE_TYPES = ["text", "number"] as const

export const ATTRIBUTE_TYPES_META: AttributeTypeMeta[] = [
	{
		id: 1,
		value: "text",
		label: "Текст",
		description: "Для текстовых характеристик (комплектация, стиль и другое)"
	},
	{
		id: 2,
		value: "number",
		label: "Число",
		description: "Для числовых параметров (габариты, вес и другое)"
	},
] as const