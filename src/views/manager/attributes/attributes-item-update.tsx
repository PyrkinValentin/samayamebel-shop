"use client"

import type { AttributeType, Errors } from "@/types"
import type { AttributeItem, AttributeOptionItem } from "./types"

import { useState, useTransition } from "react"

import { validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { updateAttributeSchema } from "./schemas"
import { updateAttributeAction } from "./actions"

import { Button, Drawer, Field, Form, Separator, Spinner } from "@cora-ui/react"

import { AttributesNameField } from "./components/attributes-name-field"
import { AttributesTypeField } from "./components/attributes-type-field"
import { AttributesOptionCreate } from "./components/attributes-option-create"
import { AttributesOptions } from "./components/attributes-options"

type AttributesItemUpdateProps = {
	attribute: AttributeItem
	onComplete: () => void
}

export const AttributesItemUpdate = (props: AttributesItemUpdateProps) => {
	const { attribute, onComplete } = props

	const [name, setName] = useState(attribute.name)
	const [type, setType] = useState<AttributeType | null>(attribute.type)
	const [options, setOptions] = useState<AttributeOptionItem[]>(attribute.options)
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})

	const hasOptions = options.length > 0

	const handleNameChange = (value: string) => {
		setName(value)
	}

	const handleTypeChange = (value: AttributeType | null) => {
		setType(value)
	}

	const handleOptionsChange = (options: AttributeOptionItem[]) => {
		setOptions(options)
	}

	const resetForm = () => {
		setName(attribute.name)
		setType(attribute.type)
		setOptions(attribute.options)
		setErrors({})
	}

	const handleFormSubmit = () => {
		const { errors, values } = validateSchema(updateAttributeSchema, {
			id: attribute.id,
			name,
			type,
			options: options.map((option) => ({
				id: option.id > 0 ? option.id : undefined,
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
				const { error } = await updateAttributeAction(values)

				if (error) {
					if (error.errors) setErrors(error.errors)
					if (error.message) toast.error(error.message)

					return
				}

				onComplete()

				toast.success(`Свойство «${values.name}» обновлено`)
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