import type { Breadcrumb } from "@/types"
import type { UnitItem } from "./types"

import { createBreadcrumbs } from "@/utils"
import { Unit } from "@/services"

export type UnitsData = {
	breadcrumbs: Breadcrumb[]
	units: UnitItem[]
}

export const getUnitsData = async (): Promise<UnitsData> => {
	const units = await Unit.findMany({
		fields: {
			id: Unit.id,
			shortName: Unit.shortName,
			name: Unit.name,
		},
	})

	const breadcrumbs = createBreadcrumbs({
		slugs: ["manager", "units"],
		items: [
			{ slug: "manager", name: "Панель" },
			{ slug: "units", name: "Ед. измерения" },
		],
	})

	return {
		breadcrumbs,
		units,
	}
}