"use client"

import type { RefObject } from "react"

import { UNIT_NAME_MAX_LENGTH } from "@/constants"

import { Field } from "@cora-ui/react"

type UnitsNameFieldProps = {
	ref?: RefObject<HTMLInputElement | null>
	autoFocus?: boolean
	name: string
	onNameChange: (name: string) => void
}

export const UnitsNameField = (props: UnitsNameFieldProps) => {
	const {
		ref,
		autoFocus,
		name,
		onNameChange,
	} = props

	return (
		<Field.Control
			ref={ref}
			autoFocus={autoFocus}
			autoComplete="off"
			placeholder="Наименование"
			maxLength={UNIT_NAME_MAX_LENGTH}
			value={name}
			onValueChange={onNameChange}
		/>
	)
}