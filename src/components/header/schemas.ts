import { Z, z } from "@/utils"

export const authSchema = z.object({
	phoneNumber: Z.phoneNumber,
})

export const otpSchema = z.object({
	phoneNumber: Z.phoneNumber,
	code: Z.code,
})