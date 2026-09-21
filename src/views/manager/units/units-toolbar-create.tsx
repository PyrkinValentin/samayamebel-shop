"use client"

import type { Errors } from "@/types"

import { useRef, useState, useTransition } from "react"

import { validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { createUnitSchema } from "./schemas"
import { createUnitAction } from "./actions"

import { Button, Drawer, Field, Form, Spinner } from "@cora-ui/react"

import { UnitsShortNameField } from "./components/units-short-name-field"
import { UnitsNameField } from "./components/units-name-field"

export const UnitsToolbarCreate = () => {
	const nameFieldRef = useRef<HTMLInputElement>(null)

	const [shortName, setShortName] = useState("")
	const [name, setName] = useState("")
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})

	const resetForm = () => {
		setShortName("")
		setName("")
		setErrors({})
	}

	const resetFormFocus = () => {
		nameFieldRef.current?.focus({ preventScroll: true })
	}

	const handleShortNameChange = (shortName: string) => {
		setShortName(shortName)
	}

	const handleNameChange = (name: string) => {
		setName(name)
	}

	const handleFormSubmit = () => {
		const { errors, values } = validateSchema(createUnitSchema, { shortName, name })

		if (errors) {
			setErrors(errors)

			return
		}

		startTransition(async () => {
			try {
				const { error } = await createUnitAction(values)

				if (error) {
					setErrors(error.errors)

					return
				}

				resetForm()
				resetFormFocus()

				toast.success(`Ед. измерения «${values.name}» добавлена`)
			} catch {
				toast.error()
			}
		})
	}

	return (
		<Form
			errors={errors}
			className="mt-4 h-full flex flex-col"
			onFormSubmit={handleFormSubmit}
		>
			<Field.Root name="name">
				<UnitsNameField
					ref={nameFieldRef}
					autoFocus
					name={name}
					onNameChange={handleNameChange}
				/>

				<Field.Error/>
			</Field.Root>

			<Field.Root
				name="shortName"
				className="mt-2"
			>
				<UnitsShortNameField
					shortName={shortName}
					onShortNameChange={handleShortNameChange}
				/>

				<Field.Error/>
			</Field.Root>

			<Drawer.Actions>
				<Button
					type="submit"
					disabled={pending}
					className="w-full"
				>
					{pending
						? <Spinner/>
						: "Добавить"
					}
				</Button>
			</Drawer.Actions>
		</Form>
	)
}