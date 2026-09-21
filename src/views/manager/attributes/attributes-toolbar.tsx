"use client"

import { useState } from "react"

import { Button, Chip, Drawer, Toolbar } from "@cora-ui/react"
import { Plus } from "lucide-react"

import { AttributesToolbarCreate } from "./attributes-toolbar-create"

type AttributesToolbarProps = {
	count: number
}

export const AttributesToolbar = (props: AttributesToolbarProps) => {
	const { count } = props

	const [open, setOpen] = useState(false)

	const handleOpen = () => setOpen(true)

	return (
		<>
			<Toolbar.Root>
				<span className="ps-3 text-sm font-medium whitespace-nowrap">
					Всего

					<Chip className="ms-2">
						{count}
					</Chip>
				</span>

				<Toolbar.Button
					render={
						<Button
							size="sm"
							className="ms-auto"
							onClick={handleOpen}
						/>
					}
				>
					<Plus/> Добавить
				</Toolbar.Button>
			</Toolbar.Root>

			<Drawer.Root
				swipeDirection="right"
				open={open}
				onOpenChange={setOpen}
			>
				<Drawer.Portal>
					<Drawer.Backdrop/>

					<Drawer.Viewport position="right">
						<Drawer.Popup className="max-sm:max-w-full">
							<Drawer.Close nativeClose/>

							<Drawer.Content className="h-full">
								<Drawer.Title>Добавить свойство</Drawer.Title>
								<Drawer.Description>Добавьте свойство и список доступных для него вариантов</Drawer.Description>
								<AttributesToolbarCreate/>
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	)
}