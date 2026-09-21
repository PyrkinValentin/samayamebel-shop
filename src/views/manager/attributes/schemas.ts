import { Z, z } from "@/zod"

export const createAttributeSchema = z.object({
	name: Z.attribute.name,
	type: Z.attribute.type,
	options: z.array(
		z.object({
			name: Z.attributeOption.name,
			description: Z.attributeOption.description,
			sortOrder: Z.sortOrder,
		}),
	),
})

export const updateAttributeSchema = z.object({
	id: Z.uuid,
	name: Z.attribute.name,
	type: Z.attribute.type,
	options: z.array(
		z.object({
			id: Z.id.optional(),
			name: Z.attributeOption.name,
			description: Z.attributeOption.description,
			sortOrder: Z.sortOrder,
		}),
	),
})

export const removeAttributeSchema = z.object({
	id: Z.uuid,
})