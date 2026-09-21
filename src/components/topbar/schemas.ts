import { Z, z } from "@/utils"

export const updateLocationSchema = z.object({
	id: Z.uuid,
})

export const createCallbackSchema = z.object({
	name: Z.username,
	phoneNumber: Z.phoneNumber,
})