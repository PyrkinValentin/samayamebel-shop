import type { LocationItem } from "./types"

import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { Location } from "@/services"

import { LOCATION_COOKIE_NAME } from "@/constants"

export type TopbarData = {
	location?: LocationItem
	locations: LocationItem[]
}

export const getTopbarData = async (): Promise<TopbarData> => {
	const cookieStore = await cookies()

	const locations = await Location.findMany({
		fields: {
			id: Location.id,
			value: Location.value,
			name: Location.name,
			phoneNumber: Location.phoneNumber,
		},
	})

	const locationId = cookieStore.get(LOCATION_COOKIE_NAME)?.value

	const location = locationId
		? locations.find((location) => location.id === locationId)
		: (
			await Location.findOne({
				fields: {
					id: Location.id,
					value: Location.value,
					name: Location.name,
					phoneNumber: Location.phoneNumber,
				},
				where: eq(Location.main, true),
			})
		)

	return { location, locations }
}
