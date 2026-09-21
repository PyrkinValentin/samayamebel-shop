"use client"

import type { KeyboardEvent } from "react"

import { useState } from "react"

import { Field } from "@cora-ui/react"

type AttributesOptionsItemNameFieldProps = {
	autoFocus: boolean
	name: string
	onNameChange: (name: string) => void
	onComplete: () => void
}

export const AttributesOptionsItemNameField = (props: AttributesOptionsItemNameFieldProps) => {
	const {
		autoFocus,
		name,
		onNameChange,
		onComplete,
	} = props

	const [value, setValue] = useState(name)

	const handleValueChange = (value: string) => {
		setValue(value)
	}

	const handleBlur = () => {
		if (name === value) return

		onNameChange(value)
	}

	const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
		if (
			ev.key === "Enter" &&
			ev.currentTarget.value.trim() !== ""
		) {
			ev.preventDefault()
			onComplete()
		}
	}

	return (
		<Field.Control
			autoFocus={autoFocus}
			autoComplete="off"
			placeholder="Значение"
			className="w-full"
			value={value}
			onValueChange={handleValueChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		/>
	)
}