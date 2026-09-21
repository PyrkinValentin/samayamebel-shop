import { Z, z } from "@/zod"

export const updateLocationSchema = z.object({
	id: Z.uuid,
})

export const createCallbackSchema = z.object({
	name: Z.username,
	phoneNumber: Z.phoneNumber,
})