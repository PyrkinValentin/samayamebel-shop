"use client"

import type { Errors } from "@/types"
import type { UnitItem } from "./types"

import { useState, useTransition } from "react"

import { validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { updateUnitSchema } from "./schemas"
import { updateUnitAction } from "./actions"

import { Button, Drawer, Field, Form, Spinner } from "@cora-ui/react"

import { UnitsNameField } from "./components/units-name-field"
import { UnitsShortNameField } from "./components/units-short-name-field"

type UnitsItemUpdateProps = {
	unit: UnitItem
	onComplete: () => void
}

export const UnitsItemUpdate = (props: UnitsItemUpdateProps) => {
	const { unit, onComplete } = props

	const [shortName, setShortName] = useState(unit.shortName)
	const [name, setName] = useState(unit.name)
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})

	const handleShortNameChange = (shortName: string) => {
		setShortName(shortName)
	}

	const handleNameChange = (name: string) => {
		setName(name)
	}

	const resetForm = () => {
		setShortName(unit.shortName)
		setName(unit.name)
		setErrors({})
	}

	const handleFormSubmit = () => {
		const { errors, values } = validateSchema(updateUnitSchema, { id: unit.id, shortName, name })

		if (errors) {
			setErrors(errors)

			return
		}

		startTransition(async () => {
			try {
				const { error } = await updateUnitAction(values)

				if (error) {
					if (error.errors) setErrors(error.errors)
					if (error.message) toast.error(error.message)

					return
				}

				onComplete()

				toast.success(`Ед. измерения «${values.name}» обновлена`)
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
					disabled={pending}
					variant="secondary"
					className="w-full"
					onClick={resetForm}
				>
					Сбросить
				</Button>

				<Button
					type="submit"
					disabled={pending}
					className="w-full"
				>
					{pending
						? <Spinner/>
						: "Сохранить"
					}
				</Button>
			</Drawer.Actions>
		</Form>
	)
}