"use client"

import type { RefObject } from "react"

import { ATTRIBUTE_NAME_MAX_LENGTH } from "@/constants"

import { Field } from "@cora-ui/react"

type AttributesNameFieldProps = {
	ref?: RefObject<HTMLInputElement | null>
	autoFocus?: boolean
	name: string
	onNameChange: (name: string) => void
}

export const AttributesNameField = (props: AttributesNameFieldProps) => {
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
			maxLength={ATTRIBUTE_NAME_MAX_LENGTH}
			value={name}
			onValueChange={onNameChange}
		/>
	)
}