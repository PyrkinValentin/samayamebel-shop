"use server"

import { APIError } from "better-auth"

import { headers } from "next/headers"
import { formatPhoneNumber, validateSchema } from "@/utils"
import { addSeconds, isAfter } from "date-fns"
import { Verification } from "@/services"
import { calculateWaitSeconds } from "./utils"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { authSchema, otpSchema } from "./schemas"

import { AUTH_MAX_ATTEMPTS } from "@/constants"

export const authAction = async (values: unknown) => {
	const { errors, data } = validateSchema(authSchema, values)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { phoneNumber } = data

	const formattedPhoneNumber = formatPhoneNumber(phoneNumber, "E.164")

	if (!formattedPhoneNumber) {
		return {
			error: {
				errors: { phoneNumber: "Некорректный номер или код страны" },
			},
		}
	}

	const stats = await Verification.getCountByPhoneNumber({
		phoneNumber: formattedPhoneNumber,
	})

	if (stats.count >= AUTH_MAX_ATTEMPTS) {
		return {
			error: { message: "Лимит отправки сообщений на сегодня исчерпан. Попробуйте завтра" },
		}
	}

	if (
		stats.count > 0 &&
		stats.createdAt
	) {
		const nextAvailableDate = addSeconds(stats.createdAt, calculateWaitSeconds(stats.count))

		if (isAfter(nextAvailableDate, new Date())) {
			return {
				data: { nextAvailableDate },
			}
		}
	}

	const headersList = await headers()

	try {
		await auth.api.sendPhoneNumberOTP({
			headers: headersList,
			body: { phoneNumber: formattedPhoneNumber },
		})

		const nextAvailableDate = addSeconds(new Date(), calculateWaitSeconds(stats.count + 1))

		return {
			data: { nextAvailableDate },
		}
	} catch (err) {
		if (err instanceof APIError) {
			return {
				error: { message: "Не удалось отправить код" },
			}
		}

		throw err
	}
}

export const OTPAction = async (values: unknown) => {
	const { errors, data } = validateSchema(otpSchema, values)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { phoneNumber, code } = data

	const formattedPhoneNumber = formatPhoneNumber(phoneNumber, "E.164")

	if (!formattedPhoneNumber) {
		return {
			error: { message: "Некорректный номер или код страны" },
		}
	}

	const headersList = await headers()

	try {
		await auth.api.verifyPhoneNumber({
			headers: headersList,
			body: { phoneNumber: formattedPhoneNumber, code },
		})

		return {
			data: {},
		}
	} catch (err) {
		if (err instanceof APIError) {
			switch (err.body?.code) {
				case "INVALID_OTP":
					return {
						error: {
							errors: { code: "Неверный код. Проверьте SMS и попробуйте еще раз" },
						},
					}

				case "TOO_MANY_ATTEMPTS":
					return {
						error: {
							errors: { code: "Превышено число попыток ввода. Запросите новый код" },
						},
					}

				default:
					return {
						error: {
							errors: { code: "Не удалось проверить код. Повторите попытку" },
						},
					}
			}
		}

		throw err
	}
}

export const afterAuthAction = async (redirectUrl?: string) => {
	revalidatePath(redirectUrl ?? "/", "layout")

	if (redirectUrl) {
		redirect(redirectUrl)
	}
}

export const signOutAction = async () => {
	const headersList = await headers()

	await auth.api.signOut({ headers: headersList })

	redirect("/")
}