"use client"

import type { AttributeType } from "@/types"

import { ATTRIBUTE_TYPES_META } from "@/constants"

import { Select } from "@cora-ui/react"

type AttributesTypeFieldProps = {
	type: AttributeType | null
	onTypeChange: (type: AttributeType | null) => void
}

export const AttributesTypeField = (props: AttributesTypeFieldProps) => {
	const { type, onTypeChange } = props

	return (
		<Select.Root
			value={type}
			onValueChange={onTypeChange}
			items={ATTRIBUTE_TYPES_META}
		>
			<Select.Trigger>
				<Select.Value placeholder="Тип данных"/>
				<Select.Icon/>
			</Select.Trigger>

			<Select.Portal>
				<Select.Positioner>
					<Select.Popup className="max-w-(--anchor-width)">
						<Select.List>
							{ATTRIBUTE_TYPES_META.map((option) => (
								<Select.Item
									key={option.id}
									value={option.value}
								>
									<span className="flex flex-col gap-0.5">
										<Select.ItemText>{option.label}</Select.ItemText>
										<span className="text-xs text-muted text-pretty">{option.description}</span>
									</span>

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