"use client"

import type { AttributeItem } from "./types"

import { useState } from "react"

import { formatOptions } from "./utils"

import { AlertDialog, Button, Drawer, Item, Menu } from "@cora-ui/react"
import { ClipboardPen, EllipsisVertical, Trash2 } from "lucide-react"

import { AttributesItemUpdate } from "./attributes-item-update"
import { AttributesItemRemove } from "./attributes-item-remove"

type AttributesItemProps = {
	attribute: AttributeItem
}

export const AttributesItem = (props: AttributesItemProps) => {
	const { attribute } = props

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
					<Item.Title>{attribute.name}</Item.Title>
					<Item.Description>{formatOptions(attribute.type, attribute.options)}</Item.Description>
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
								<Drawer.Title>Редактировать «{attribute.name}»</Drawer.Title>
								<Drawer.Description>Редактируйте свойство и список доступных для него вариантов</Drawer.Description>

								<AttributesItemUpdate
									attribute={attribute}
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
						<AlertDialog.Title>Удалить «{attribute.name}»?</AlertDialog.Title>

						<AlertDialog.Description>
							Восстановить свойство будет невозможно. Вы уверены, что хотите продолжить?
						</AlertDialog.Description>

						<AttributesItemRemove attribute={attribute}/>
					</AlertDialog.Popup>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</>
	)
}