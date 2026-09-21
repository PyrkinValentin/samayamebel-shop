import type { User } from "@/types"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { anonymous, phoneNumber, customSession } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { nextCookies } from "better-auth/next-js"
import { db, schema } from "@/db"
import { generateRandomEmail } from "./utils"

import { AUTH_OTP_LENGTH } from "@/constants"

export type AuthInstance = typeof auth

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "mysql",
		schema,
	}),
	databaseHooks: {
		user: {
			create: {
				before: async (user) => ({
					data: { ...user, name: "" },
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
		anonymous({
			generateRandomEmail,
			onLinkAccount: async (data) => {
				const { anonymousUser, newUser } = data

				console.log(anonymousUser, newUser)
				//Implement migrate anonymous user -> new user
			}
		}),
		phoneNumber({
			otpLength: AUTH_OTP_LENGTH,
			sendOTP: (data) => {
				const { phoneNumber, code } = data

				console.log(phoneNumber, code)
				// Implement sending OTP code via SMS
			},
			signUpOnVerification: {
				getTempEmail: generateRandomEmail,
			},
		}),
		passkey(),
		customSession(async (session) => {
			const { id, role, isAnonymous } = session.user as User

			return {
				...session,
				user: { id, role, isAnonymous },
			}
		}),
		nextCookies(),
	],
})