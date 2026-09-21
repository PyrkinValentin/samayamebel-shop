"use client"

import type { LocationItem } from "./types"

import { Select } from "@cora-ui/react"

type TopbarLocationSelectProps = {
	location?: LocationItem
	locations: LocationItem[]
	onLocationChange: (locationId: string | null) => void
}

export const TopbarLocationSelect = (props: TopbarLocationSelectProps) => {
	const {
		location,
		locations,
		onLocationChange,
	} = props

	const hasLocations = locations.length > 0

	return (
		<Select.Root
			value={location?.id ?? null}
			onValueChange={onLocationChange}
		>
			<Select.Trigger className="mt-6">
				<Select.Value placeholder="Выберите населенный пункт">
					{location
						? (locationId: string | null) => locationId
							? locations.find((location) => location.id === locationId)?.name
							: null
						: undefined
					}
				</Select.Value>

				<Select.Icon/>
			</Select.Trigger>

			<Select.Portal>
				<Select.Positioner>
					<Select.Popup>
						<Select.List>
							{!hasLocations && (
								<span className="px-2 py-2 text-sm text-muted">
									Список пуст
								</span>
							)}

							{locations.map((location) => (
								<Select.Item
									key={location.id}
									value={location.id}
								>
									<Select.ItemText>{location.name}</Select.ItemText>
									<Select.ItemIndicator/>
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	)
}