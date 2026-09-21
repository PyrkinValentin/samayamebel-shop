"use client"

import type { DragEndEvent } from "@dnd-kit/react"
import type { AttributeOptionItem } from "../../types"

import { move } from "@dnd-kit/helpers"
import { reindexSortOrder } from "@/utils"
import { createOption } from "../../utils"
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers"

import { DragDropProvider } from "@dnd-kit/react"
import { ScrollArea } from "@cora-ui/react"

import { AttributesOptionsItem } from "./attributes-options-item"

type AttributesOptionsProps = {
	options: AttributeOptionItem[]
	onOptionsChange: (options: AttributeOptionItem[]) => void
}

export const AttributesOptions = (props: AttributesOptionsProps) => {
	const { options, onOptionsChange } = props

	const handleDragEnd = (ev: DragEndEvent) => {
		if (ev.canceled) return

		const nextOptions = move(options, ev)

		if (options === nextOptions) return

		onOptionsChange(reindexSortOrder(nextOptions))
	}

	const handleOptionChange = (option: AttributeOptionItem, index: number) => {
		onOptionsChange(options.with(index, option))
	}

	const handleOptionCreate = () => {
		onOptionsChange([...options, createOption(options)])
	}

	const handleOptionRemove = (index: number) => {
		onOptionsChange(
			reindexSortOrder(options.toSpliced(index, 1))
		)
	}

	return (
		<DragDropProvider
			modifiers={[RestrictToVerticalAxis]}
			onDragEnd={handleDragEnd}
		>
			<ScrollArea.Root className="-m-1 w-[calc(100%+0.5rem)]">
				<ScrollArea.Viewport scrollFade>
					<ScrollArea.Content className="p-1">
						<div className="flex flex-col gap-2">
							{options.map((option, index) => (
								<AttributesOptionsItem
									key={option.id}
									autoFocus={options.length - 1 === index && option.id < 0}
									index={index}
									option={option}
									onOptionChange={handleOptionChange}
									onOptionCreate={handleOptionCreate}
									onOptionRemove={handleOptionRemove}
								/>
							))}
						</div>
					</ScrollArea.Content>
				</ScrollArea.Viewport>

				<ScrollArea.ScrollBar>
					<ScrollArea.Thumb/>
				</ScrollArea.ScrollBar>
			</ScrollArea.Root>
		</DragDropProvider>
	)
}