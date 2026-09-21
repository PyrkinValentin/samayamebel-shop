"use client"

import type { AttributeType, Errors } from "@/types"
import type { AttributeOptionItem } from "./types"

import { useRef, useState, useTransition } from "react"

import { validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { createAttributeSchema } from "./schemas"
import { createAttributeAction } from "./actions"

import { Button, Drawer, Field, Form, Separator, Spinner } from "@cora-ui/react"

import { AttributesNameField } from "./components/attributes-name-field"
import { AttributesTypeField } from "./components/attributes-type-field"
import { AttributesOptionCreate } from "./components/attributes-option-create"
import { AttributesOptions } from "./components/attributes-options"

export const AttributesToolbarCreate = () => {
	const nameFieldRef = useRef<HTMLInputElement>(null)

	const [name, setName] = useState("")
	const [type, setType] = useState<AttributeType | null>(null)
	const [options, setOptions] = useState<AttributeOptionItem[]>([])
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})

	const hasOptions = options.length > 0

	const resetForm = () => {
		setName("")
		setType(null)
		setOptions([])
		setErrors({})
	}

	const resetFormFocus = () => {
		nameFieldRef.current?.focus({ preventScroll: true })
	}

	const handleNameChange = (name: string) => {
		setName(name)
	}

	const handleTypeChange = (type: AttributeType | null) => {
		setType(type)
	}

	const handleOptionsChange = (options: AttributeOptionItem[]) => {
		setOptions(options)
	}

	const handleFormSubmit = () => {
		const { errors, values } = validateSchema(createAttributeSchema, {
			name,
			type,
			options: options.map((option) => ({
				name: option.name,
				description: option.description,
				sortOrder: option.sortOrder,
			})),
		})

		if (errors) {
			setErrors(errors)

			return
		}

		startTransition(async () => {
			try {
				const { error } = await createAttributeAction(values)

				if (error) {
					setErrors(error.errors)

					return
				}

				resetForm()
				resetFormFocus()

				toast.success(`Свойство «${values.name}» добавлено`)
			} catch {
				toast.error()
			}
		})
	}

	return (
		<Form
			errors={errors}
			className="mt-4 min-h-0 h-full flex flex-col"
			onFormSubmit={handleFormSubmit}
		>
			<Field.Root name="name">
				<AttributesNameField
					ref={nameFieldRef}
					autoFocus
					name={name}
					onNameChange={handleNameChange}
				/>

				<Field.Error/>
			</Field.Root>

			<Field.Root
				name="type"
				className="mt-2"
			>
				<AttributesTypeField
					type={type}
					onTypeChange={handleTypeChange}
				/>

				<Field.Error/>
			</Field.Root>

			<div className="mt-6 flex items-center justify-between gap-2">
				<AttributesOptionCreate
					options={options}
					onOptionsChange={handleOptionsChange}
				/>
			</div>

			<Separator className="my-4"/>

			{hasOptions ? (
				<AttributesOptions
					options={options}
					onOptionsChange={handleOptionsChange}
				/>
			) : (
				<span className="text-sm text-pretty text-muted text-center">
					Нет значений
				</span>
			)}

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