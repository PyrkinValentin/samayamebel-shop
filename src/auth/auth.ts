import type { User } from "@/types"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { phoneNumber, customSession } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { nextCookies } from "better-auth/next-js"
import { db, schema } from "@/db"

import { AUTH_OTP_LENGTH } from "@/constants"

export type Auth = typeof auth

const getTempEmail = () => `${crypto.randomUUID()}@temp.local`
const getTempName = () => ""

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "mysql",
		schema,
	}),
	databaseHooks: {
		user: {
			create: {
				before: async (user) => ({
					data: {
						...user,
						email: "",
					},
				}),
			},
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24,
		},
	},
	advanced: {
		database: {
			generateId: () => crypto.randomUUID(),
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				input: false,
			},
		},
	},
	plugins: [
		phoneNumber({
			otpLength: AUTH_OTP_LENGTH,
			sendOTP: (data) => {
				console.log("sendOTP", data.code)
				// Implement sending OTP code via SMS
			},
			signUpOnVerification: {
				getTempEmail,
				getTempName,
			},
		}),
		passkey(),
		customSession(async (session) => {
			const { id, role } = session.user as User

			return {
				session: session.session,
				user: { id, role },
			}
		}),
		nextCookies(),
	],
})