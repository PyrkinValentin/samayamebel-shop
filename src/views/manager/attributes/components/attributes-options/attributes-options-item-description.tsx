"use client"

import { useState } from "react"

import { ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH } from "@/constants"

import { Textarea } from "@cora-ui/react"

type AttributesOptionsItemDescriptionProps = {
	description: string | null
	onDescriptionChange: (description: string) => void
}

export const AttributesOptionsItemDescription = (props: AttributesOptionsItemDescriptionProps) => {
	const { description, onDescriptionChange } = props

	const [value, setValue] = useState(description ?? "")

	const handleValueChange = (value: string) => {
		setValue(value)
	}

	const handleBlur = () => {
		if (description === value) return

		onDescriptionChange(value)
	}

	return (
		<Textarea
			autoResize
			maxLength={ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH}
			placeholder="Описание"
			value={value}
			onValueChange={handleValueChange}
			onBlur={handleBlur}
		/>
	)
}