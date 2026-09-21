"use client"

import type { LocationItem } from "./types"

import { useOptimistic, useState, useTransition } from "react"

import { combineErrorsSchema, validateSchema } from "@/utils"
import { toast } from "@/components/toast"

import { updateLocationSchema } from "./schemas"
import { updateLocationAction } from "./actions"

import { Dialog } from "@cora-ui/react"
import { ChevronDown, Navigation } from "lucide-react"
import { TopbarLocationSelect } from "./topbar-location-select"

type TopbarLocationProps = {
	location: LocationItem | undefined
	locations: LocationItem[]
}

export const TopbarLocation = (props: TopbarLocationProps) => {
	const {
		location: locationProp,
		locations,
	} = props

	const [selectLocationOpen, setSelectLocationOpen] = useState(false)
	const [location, setLocation] = useOptimistic(locationProp)
	const [, startLocationTransition] = useTransition()

	const handleLocationChange = (id: string | null) => {
		const { errors, data } = validateSchema(updateLocationSchema, { id })

		if (errors) {
			toast.error(combineErrorsSchema(errors))

			return
		}

		const location = locations.find((location) => location.id === id)

		setSelectLocationOpen(false)

		startLocationTransition(async () => {
			setLocation(location)

			try {
				const { error } = await updateLocationAction(data)

				if (error) {
					toast.error(error.message)
				}
			} catch {
				toast.error()
			}
		})
	}

	return (
		<Dialog.Root
			open={selectLocationOpen}
			onOpenChange={setSelectLocationOpen}
		>
			<Dialog.Trigger className="flex items-center gap-2 text-xs">
				<Navigation
					strokeWidth="1.5"
					className="size-3.5"
				/>

				{location?.name ?? "Населенный пункт"}
				<ChevronDown className="size-3.5 text-muted"/>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Backdrop/>

				<Dialog.Popup>
					<Dialog.Close nativeClose/>
					<Dialog.Title>Населенный пункт</Dialog.Title>
					<Dialog.Description>Выберите ваш населенный пункт, чтобы увидеть точные условия доставки</Dialog.Description>

					<TopbarLocationSelect
						location={location}
						locations={locations}
						onLocationChange={handleLocationChange}
					/>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}