import type { Breadcrumb, Pagination } from "@/types"
import type { AttributeItem } from "./types"

import { createBreadcrumbs, extractPageFromSlugs, mergeRelations } from "@/utils"
import { notFound } from "next/navigation"
import { inArray } from "drizzle-orm"
import { Attribute, AttributeOption } from "@/services"

export type AttributesData = {
	breadcrumbs: Breadcrumb[]
	attributes: AttributeItem[]
	pagination: Pagination
}

export const getAttributesData = async (slugs?: string[]): Promise<AttributesData> => {
	const { page, valid } = extractPageFromSlugs(slugs)

	if (!valid) notFound()

	const breadcrumbs = createBreadcrumbs({
		slugs: ["manager", "attributes"],
		items: [
			{ slug: "manager", name: "Панель" },
			{ slug: "attributes", name: "Свойства" },
		],
	})

	const { rows: attributes, pagination } = await Attribute.findManyPaginated({
		page,
		fields: {
			id: Attribute.id,
			type: Attribute.type,
			name: Attribute.name,
		},
	})

	const attributeOptions = await AttributeOption.findMany({
		fields: {
			id: AttributeOption.id,
			attributeId: AttributeOption.attributeId,
			name: AttributeOption.name,
			description: AttributeOption.description,
			sortOrder: AttributeOption.sortOrder,
		},
		where: inArray(
			AttributeOption.attributeId,
			attributes.map((attribute) => attribute.id),
		),
	})

	const attributesWithOptions = mergeRelations(
		attributes,
		attributeOptions,
		"attributeId",
		"options",
	)

	return {
		breadcrumbs,
		attributes: attributesWithOptions,
		pagination,
	}
}