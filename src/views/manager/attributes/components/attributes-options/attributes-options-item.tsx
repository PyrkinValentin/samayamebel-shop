"use client"

import type { TouchEvent } from "react"
import type { AttributeOptionItem } from "../../types"

import { useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable"

import { classNames } from "@cora-ui/react/utils"

import { Button, ButtonGroup, Collapsible, Field, InputGroup } from "@cora-ui/react"
import { GripVertical, MessageSquareCheck, MessageSquareMore, Trash2 } from "lucide-react"

import { AttributesOptionsItemNameField } from "./attributes-options-item-name-field"
import { AttributesOptionsItemDescription } from "./attributes-options-item-description"

type AttributesOptionsItemProps = {
	autoFocus: boolean
	index: number
	option: AttributeOptionItem
	onOptionChange: (option: AttributeOptionItem, index: number) => void
	onOptionCreate: () => void
	onOptionRemove: (index: number) => void
}

export const AttributesOptionsItem = (props: AttributesOptionsItemProps) => {
	const {
		autoFocus,
		index,
		option,
		onOptionChange,
		onOptionCreate,
		onOptionRemove,
	} = props

	const { ref, handleRef, isDragging } = useSortable({ id: option.id, index })

	const [descriptionOpen, setDescriptionOpen] = useState(false)

	const hasDescription = !!option.description

	const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
		e.stopPropagation()
	}

	const handleNameChange = (name: string) => {
		onOptionChange({ ...option, name }, index)
	}

	const handleDescriptionToggle = () => {
		setDescriptionOpen(!descriptionOpen)
	}

	const handleDescriptionChange = (description: string) => {
		onOptionChange({ ...option, description }, index)
	}

	const handleOptionRemove = () => {
		onOptionRemove(index)
	}

	return (
		<div
			ref={ref}
			className="select-none"
		>
			<div
				className={
					classNames(
						"flex flex-col transition-transform motion-reduce:transition-none",
						isDragging
							? "scale-105"
							: "",
					)
				}
			>
				<div className="flex items-start gap-2">
					<Field.Root name={`options.${index}.name`}>
						<InputGroup
							className={
								classNames(
									"pl-0.5 transition-shadow motion-reduce:transition-none",
									isDragging
										? "shadow-lg"
										: "",
								)
							}
						>
							<Button
								iconOnly
								ref={handleRef}
								variant="ghost"
								size="sm"
								className="shrink-0 cursor-grab"
								onTouchStart={handleTouchStart}
							>
								<GripVertical/>
							</Button>

							<AttributesOptionsItemNameField
								autoFocus={autoFocus}
								name={option.name}
								onNameChange={handleNameChange}
								onComplete={onOptionCreate}
							/>
						</InputGroup>

						<Field.Error/>
					</Field.Root>

					<ButtonGroup
						iconOnly
						variant="outline"
						className={
							classNames(
								"rounded-md bg-background transition-shadow motion-reduce:transition-none",
								isDragging
									? "shadow-lg"
									: "",
							)
						}
					>
						<Button onClick={handleDescriptionToggle}>
							{hasDescription
								? <MessageSquareCheck/>
								: <MessageSquareMore/>
							}
						</Button>

						<Button onClick={handleOptionRemove}>
							<Trash2/>
						</Button>
					</ButtonGroup>
				</div>

				<Collapsible.Root
					open={descriptionOpen}
					onOpenChange={setDescriptionOpen}
				>
					<Collapsible.Panel className="-m-1 p-1">
						<div className="mt-2 mb-4 flex flex-col gap-1">
							<AttributesOptionsItemDescription
								description={option.description}
								onDescriptionChange={handleDescriptionChange}
							/>

							<span className="text-xs text-muted text-pretty">
								Отобразится во всплывающей подсказке в карточке товара при нажатии на это значение
							</span>
						</div>
					</Collapsible.Panel>
				</Collapsible.Root>
			</div>
		</div>
	)
}