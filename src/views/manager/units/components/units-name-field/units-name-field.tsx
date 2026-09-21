"use client"

import { UNIT_SHORT_NAME_MAX_LENGTH } from "@/constants"

import { Field } from "@cora-ui/react"

type UnitsShortNameFieldProps = {
	autofocus?: boolean
	shortName: string
	onShortNameChange: (shortName: string) => void
}

export const UnitsShortNameField = (props: UnitsShortNameFieldProps) => {
	const {
		autofocus,
		shortName,
		onShortNameChange,
	} = props

	return (
		<Field.Control
			autoFocus={autofocus}
			autoComplete="off"
			placeholder="Например: см"
			maxLength={UNIT_SHORT_NAME_MAX_LENGTH}
			value={shortName}
			onValueChange={onShortNameChange}
		/>
	)
}