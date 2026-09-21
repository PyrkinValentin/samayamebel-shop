import type { Metadata } from "next"

import { getUnitsData, Units } from "@/views/manager/units"

export const metadata: Metadata = {
	title: "Единицы измерения",
}

const UnitsPage = async () => {
	const unitsData = await getUnitsData()

	return (
		<Units {...unitsData}/>
	)
}

export default UnitsPage