"use client"

import { ATTRIBUTE_NAME_MAX_LENGTH } from "@/constants"

import { Field } from "@cora-ui/react"

type AttributesNameFieldProps = {
	autofocus?: boolean
	name: string
	onNameChange: (name: string) => void
}

export const AttributesNameField = (props: AttributesNameFieldProps) => {
	const {
		autofocus,
		name,
		onNameChange,
	} = props

	return (
		<Field.Control
			autoFocus={autofocus}
			autoComplete="off"
			placeholder="Наименование"
			maxLength={ATTRIBUTE_NAME_MAX_LENGTH}
			value={name}
			onValueChange={onNameChange}
		/>
	)
}