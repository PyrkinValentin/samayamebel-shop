"use client"

import type { Errors } from "@/types"

import { useState, useTransition } from "react"

import { inputPhoneNumber } from "@/utils"
import { validateSchema } from "@/zod"
import { isAfter } from "date-fns"
import { toast } from "@/components/toast"

import { authSchema } from "./schemas"
import { authAction } from "./actions"

import { PHONE_NUMBER_MAX_LENGTH } from "@/constants"

import { Button, Dialog, Field, Form, Spinner } from "@cora-ui/react"

import { HeaderAccountLoginAuthOtp } from "./header-account-login-auth-otp"

export const HeaderAccountLoginAuth = () => {
	const [phoneNumber, setPhoneNumber] = useState("")
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})
	const [nextAvailableDate, setNextAvailableDate] = useState<Date>()
	const [OTPOpen, setOTPOpen] = useState(false)

	const handlePhoneNumberChange = (value: string) => {
		setPhoneNumber(inputPhoneNumber(value))
	}

	const handleFormSubmit = () => {
		if (
			nextAvailableDate &&
			isAfter(nextAvailableDate, new Date())
		) {
			setOTPOpen(true)

			return
		}

		const { errors, values } = validateSchema(authSchema, { phoneNumber })

		if (errors) {
			setErrors(errors)

			return
		}

		startTransition(async () => {
			try {
				const { error, data } = await authAction(values)

				if (error) {
					if (error.errors) setErrors(error.errors)
					if (error.message) toast.error(error.message)

					return
				}

				setOTPOpen(true)
				setNextAvailableDate(data.nextAvailableDate)
			} catch {
				toast.error()
			}
		})
	}

	return (
		<>
			<Form
				errors={errors}
				className="mt-6 flex flex-col gap-2"
				onFormSubmit={handleFormSubmit}
			>
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
						: "Получить код"
					}
				</Button>
			</Form>

			<Dialog.Root
				open={OTPOpen}
				onOpenChange={setOTPOpen}
			>
				<Dialog.Portal>
					<Dialog.Backdrop/>

					<Dialog.Popup>
						<Dialog.Close nativeClose/>
						<Dialog.Title>Введите код из SMS</Dialog.Title>

						{!!nextAvailableDate && (
							<HeaderAccountLoginAuthOtp
								phoneNumber={phoneNumber}
								nextAvailableDate={nextAvailableDate}
							/>
						)}
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	)
}