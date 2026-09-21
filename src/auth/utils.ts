import type { UserRole } from "@/types"

import { forbidden, unauthorized } from "next/navigation"
import { auth } from "./auth"

import { USER_EMAIL_MAX_LENGTH } from "@/constants"

const EMAIL_DOMAIN_NAME = "@temp.local"

export const generateRandomEmail = () => {
	const uuid = crypto
		.randomUUID()
		.replaceAll("-", "")

	const prefix = `temp-${uuid}`
	const maxPrefixLength = USER_EMAIL_MAX_LENGTH - EMAIL_DOMAIN_NAME.length

	return `${prefix.slice(0, maxPrefixLength)}${EMAIL_DOMAIN_NAME}`
}

export const requireAuth = async (headers: Headers, role: UserRole) => {
	const session = await auth.api.getSession({
		headers,
		query: {
			disableCookieCache: true,
		},
	})
	
	if (!session || session.user.isAnonymous) {
		unauthorized()
	}

	if (session.user.role !== role) {
		forbidden()
	}

	return session
}