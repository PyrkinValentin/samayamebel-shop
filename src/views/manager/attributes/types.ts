import type { Attribute, AttributeOption } from "@/types"

export type AttributeItem = Pick<Attribute, "id" | "type" | "name"> & {
	options: AttributeOptionItem[]
}

export type AttributeOptionItem = Pick<AttributeOption, "id" | "name" | "description" | "sortOrder">