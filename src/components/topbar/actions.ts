"use server"

import { formatPhoneNumber } from "@/utils"
import { validateSchema } from "@/zod"
import { cookies } from "next/headers"
import { Callback, Location } from "@/services"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { LOCATION_COOKIE_NAME } from "@/constants"

import { createCallbackSchema, updateLocationSchema } from "./schemas"

export const updateLocationAction = async (data: unknown) => {
	const { errors, values } = validateSchema(updateLocationSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id } = values

	const cookieStore = await cookies()

	cookieStore.set(LOCATION_COOKIE_NAME, id, {
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
		sameSite: "lax",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	})

	return {
		data: {},
	}
}

export const createCallbackAction = async (data: unknown) => {
	const { errors, values } = validateSchema(createCallbackSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { name, phoneNumber } = values

	const formattedPhoneNumber = formatPhoneNumber(phoneNumber, "E.164")

	if (!formattedPhoneNumber) {
		return {
			error: {
				errors: { phoneNumber: "Некорректный номер или код страны" },
			},
		}
	}

	const pendingCallback = await Callback.findOne({
		fields: { id: Callback.id },
		where: and(
			eq(Callback.status, "pending"),
			eq(Callback.phoneNumber, formattedPhoneNumber),
		)
	})

	if (!pendingCallback) {
		const cookieStore = await cookies()

		let locationId = cookieStore.get(LOCATION_COOKIE_NAME)?.value

		if (!locationId) {
			const locationMain = await Location.findOne({
				fields: { id: Location.id },
				where: eq(Location.main, true),
			})

			locationId = locationMain?.id
		}

		await Callback.create({
			values: {
				locationId,
				name,
				phoneNumber: formattedPhoneNumber,
			},
		})

		revalidatePath("/", "layout")
	}

	return {
		data: {},
	}
}