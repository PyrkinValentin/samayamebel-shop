"use client"

import type { UnitItem } from "./types"

import { useState } from "react"

import { AlertDialog, Button, Drawer, Item, Menu } from "@cora-ui/react"
import { ClipboardPen, EllipsisVertical, Trash2 } from "lucide-react"

import { UnitsItemUpdate } from "./units-item-update"
import { UnitsItemRemove } from "./units-item-remove"

type UnitsItemProps = {
	unit: UnitItem
}

export const UnitsItem = (props: UnitsItemProps) => {
	const { unit } = props

	const [updateOpen, setUpdateOpen] = useState<boolean>(false)
	const [removeOpen, setRemoveOpen] = useState<boolean>(false)

	// TODO: Добавить hasSpecifications
	const hasSpecifications = false

	const handleUpdateOpen = () => {
		setUpdateOpen(true)
	}

	const handleUpdateComplete = () => {
		setUpdateOpen(false)
	}

	const handleRemoveOpen = () => {
		setRemoveOpen(true)
	}

	return (
		<>
			<Item.Root>
				<Item.Content>
					<Item.Title>{unit.name} ({unit.shortName})</Item.Title>
				</Item.Content>

				<Item.Action>
					<Menu.Root>
						<Menu.Trigger
							render={
								<Button
									iconOnly
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical/>
						</Menu.Trigger>

						<Menu.Portal>
							<Menu.Positioner align="end">
								<Menu.Popup>
									<Menu.Arrow/>

									<Menu.Item onClick={handleUpdateOpen}>
										<ClipboardPen/> Редактировать
									</Menu.Item>

									<Menu.Item
										disabled={hasSpecifications}
										className="flex-col items-start gap-0.5"
										onClick={handleRemoveOpen}
									>
										<div className="flex items-center gap-2">
											<Trash2 className="size-4 text-muted"/> Удалить
										</div>

										{hasSpecifications && (
											<span className="ms-6 max-w-36 text-xs text-muted">
												Используется в спецификациях
											</span>
										)}
									</Menu.Item>
								</Menu.Popup>
							</Menu.Positioner>
						</Menu.Portal>
					</Menu.Root>
				</Item.Action>
			</Item.Root>

			<Drawer.Root
				swipeDirection="right"
				open={updateOpen}
				onOpenChange={setUpdateOpen}
			>
				<Drawer.Portal>
					<Drawer.Backdrop/>

					<Drawer.Viewport position="right">
						<Drawer.Popup className="max-sm:max-w-full">
							<Drawer.Close nativeClose/>

							<Drawer.Content className="h-full">
								<Drawer.Title>Редактировать «{unit.name}»</Drawer.Title>
								<Drawer.Description>Редактируйте единицу измерения для характеристик товаров</Drawer.Description>

								<UnitsItemUpdate
									unit={unit}
									onComplete={handleUpdateComplete}
								/>
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>

			<AlertDialog.Root
				open={removeOpen}
				onOpenChange={setRemoveOpen}
			>
				<AlertDialog.Portal>
					<AlertDialog.Backdrop/>

					<AlertDialog.Popup>
						<AlertDialog.Close nativeClose/>
						<AlertDialog.Title>Удалить «{unit.name}»?</AlertDialog.Title>

						<AlertDialog.Description>
							Восстановить единицу измерения будет невозможно. Вы уверены, что хотите продолжить?
						</AlertDialog.Description>

						<UnitsItemRemove unit={unit}/>
					</AlertDialog.Popup>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</>
	)
}