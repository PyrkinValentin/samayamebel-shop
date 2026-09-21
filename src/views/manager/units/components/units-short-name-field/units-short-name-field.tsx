"use client"

import { UNIT_SHORT_NAME_MAX_LENGTH } from "@/constants"

import { Field } from "@cora-ui/react"

type UnitsShortNameFieldProps = {
	shortName: string
	onShortNameChange: (shortName: string) => void
}

export const UnitsShortNameField = (props: UnitsShortNameFieldProps) => {
	const {
		shortName,
		onShortNameChange,
	} = props

	return (
		<Field.Control
			autoComplete="off"
			placeholder="Краткое наименование"
			maxLength={UNIT_SHORT_NAME_MAX_LENGTH}
			value={shortName}
			onValueChange={onShortNameChange}
		/>
	)
}