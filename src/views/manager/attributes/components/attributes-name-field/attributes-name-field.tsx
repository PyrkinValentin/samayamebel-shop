"use client"

import { useState } from "react"

import { ATTRIBUTE_NAME_MAX_LENGTH } from "@/constants"

import { Field } from "@cora-ui/react"

type AttributesNameFieldProps = {
	name: string
	onNameChange: (name: string) => void
}

export const AttributesNameField = (props: AttributesNameFieldProps) => {
	const { name, onNameChange } = props

	const [value, setValue] = useState(name)

	const handleValueChange = (value: string) => {
		setValue(value)
	}

	const handleBlur = () => {
		onNameChange(value)
	}

	return (
		<Field.Control
			autoFocus
			autoComplete="off"
			placeholder="Наименование"
			maxLength={ATTRIBUTE_NAME_MAX_LENGTH}
			value={value}
			onValueChange={handleValueChange}
			onBlur={handleBlur}
		/>
	)
}