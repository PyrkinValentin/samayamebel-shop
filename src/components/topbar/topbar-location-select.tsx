"use client"

import type { LocationItem } from "./types"

import { useMemo, useTransition } from "react"

import { combineErrorsSchema, validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { updateLocationSchema } from "./schemas"
import { updateLocationAction } from "./actions"

import { Select } from "@cora-ui/react"

type TopbarLocationSelectProps = {
	location?: LocationItem
	locations: LocationItem[]
	onLocationChange: (location?: LocationItem) => void
}

export const TopbarLocationSelect = (props: TopbarLocationSelectProps) => {
	const {
		location,
		locations,
		onLocationChange,
	} = props

	const [, startTransition] = useTransition()

	const hasLocations = locations.length > 0

	const items = useMemo(() => {
		return locations.map((location) => ({ value: location.id, label: location.name }))
	}, [locations])

	const handleLocationChange = (id: string | null) => {
		const { errors, values } = validateSchema(updateLocationSchema, { id })

		if (errors) {
			toast.error(combineErrorsSchema(errors))

			return
		}

		const location = locations.find((location) => location.id === id)

		startTransition(async () => {
			onLocationChange(location)

			try {
				const { error } = await updateLocationAction(values)

				if (error) {
					toast.error(combineErrorsSchema(error.errors))
				}
			} catch {
				toast.error()
			}
		})
	}

	return (
		<Select.Root
			value={location?.id ?? null}
			onValueChange={handleLocationChange}
			items={items}
		>
			<Select.Trigger className="mt-6">
				<Select.Value placeholder="Выберите населенный пункт"/>
				<Select.Icon/>
			</Select.Trigger>

			<Select.Portal>
				<Select.Positioner>
					<Select.Popup>
						<Select.List>
							{hasLocations ? locations.map((location) => (
								<Select.Item
									key={location.id}
									value={location.id}
								>
									<Select.ItemText>{location.name}</Select.ItemText>
									<Select.ItemIndicator/>
								</Select.Item>
							)) : (
								<span className="px-2 py-2 text-sm text-muted">
									Список пуст
								</span>
							)}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	)
}