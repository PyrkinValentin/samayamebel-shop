"use client"

import type { Errors } from "@/types"

import { useState, useTransition } from "react"

import { inputPhoneNumber } from "@/utils"
import { validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { createCallbackSchema } from "./schemas"
import { createCallbackAction } from "./actions"

import { PHONE_NUMBER_MAX_LENGTH, USER_NAME_MAX_LENGTH } from "@/constants"

import { Button, Field, Form, Spinner } from "@cora-ui/react"

type TopbarCallbackCreateProps = {
	onCompleted: () => void
}

export const TopbarCallbackCreate = (props: TopbarCallbackCreateProps) => {
	const { onCompleted } = props

	const [name, setName] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})

	const handleNameChange = (name: string) => {
		setName(name)
	}

	const handlePhoneNumberChange = (value: string) => {
		setPhoneNumber(inputPhoneNumber(value))
	}

	const handleFormSubmit = () => {
		const { errors, values } = validateSchema(createCallbackSchema, { name, phoneNumber })

		if (errors) {
			setErrors(errors)

			return
		}

		startTransition(async () => {
			try {
				const { error } = await createCallbackAction(values)

				if (error) {
					setErrors(error.errors)

					return
				}

				onCompleted()
			} catch {
				toast.error()
			}
		})
	}

	return (
		<Form
			errors={errors}
			className="mt-6 flex flex-col gap-2"
			onFormSubmit={handleFormSubmit}
		>
			<Field.Root name="name">
				<Field.Control
					autoComplete="off"
					placeholder="Имя"
					maxLength={USER_NAME_MAX_LENGTH}
					value={name}
					onValueChange={handleNameChange}
				/>

				<Field.Error/>
			</Field.Root>

			<Field.Root name="phoneNumber">
				<Field.Control
					type="tel"
					autoComplete="off"
					placeholder="Номер телефона"
					maxLength={PHONE_NUMBER_MAX_LENGTH}
					value={phoneNumber}
					onValueChange={handlePhoneNumberChange}
				/>

				<Field.Error/>
			</Field.Root>

			<Button
				type="submit"
				disabled={pending}
				className="mt-2 w-full"
			>
				{pending
					? <Spinner/>
					: "Отправить"
				}
			</Button>
		</Form>
	)
}