import { Z, z } from "@/utils"

export const createAttributeSchema = z.object({
	name: Z.attribute.name,
	type: Z.attribute.type,
	options: z.array(
		z.object({
			name: Z.attributeOption.name,
			description: Z.attributeOption.description,
			sortOrder: Z.attributeOption.sortOrder,
		}),
	),
})