"use client"

import type { LocationItem } from "./types"

import { useOptimistic, useState } from "react"

import { Dialog } from "@cora-ui/react"
import { ChevronDown, Navigation } from "lucide-react"

import { TopbarLocationSelect } from "./topbar-location-select"

type TopbarLocationProps = {
	location?: LocationItem
	locations: LocationItem[]
}

export const TopbarLocation = (props: TopbarLocationProps) => {
	const {
		location: locationProp,
		locations,
	} = props

	const [location, setLocation] = useOptimistic(locationProp)
	const [open, setOpen] = useState(false)

	const handleLocationChange = (location?: LocationItem) => {
		setLocation(location)
		setOpen(false)
	}

	return (
		<Dialog.Root
			open={open}
			onOpenChange={setOpen}
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