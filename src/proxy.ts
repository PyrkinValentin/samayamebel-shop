import type { NextRequest } from "next/server"

import { NextResponse, userAgent } from "next/server"
import { auth } from "@/auth"
import { getSessionCookie } from "better-auth/cookies"
import { guestSessionService } from "@/services"

import { AUTH_REDIRECT_PARAM, RESTRICTED_AUTH_ROUTES, GUEST_SESSION_ID_PARAM } from "@/constants"

const proxy = async (request: NextRequest) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	})

	const restricted = RESTRICTED_AUTH_ROUTES.some((route) => {
		return request
			.nextUrl
			.pathname
			.startsWith(route)
	})

	if (!restricted) {
		return await responseWithSessionId(request, NextResponse.next())
	}

	if (!session) {
		return await responseWithSessionId(request, NextResponse.redirect(createRedirectUrl(request)))
	}

	const targetRole = request
		.nextUrl
		.pathname
		.split("/")
		.filter(Boolean)
		.at(0)

	return await responseWithSessionId(
		request,
		targetRole && targetRole !== session.user.role
			? NextResponse.rewrite(new URL("/404", request.url))
			: NextResponse.next()
	)
}

const responseWithSessionId = async (request: NextRequest, response: NextResponse) => {
	const hasGuestSessionId = request.cookies.has(GUEST_SESSION_ID_PARAM)
	const sessionCookie = getSessionCookie(request)

	if (
		!hasGuestSessionId &&
		!sessionCookie
	) {
		const ua = userAgent({ headers: request.headers })

		if (!ua.isBot) {
			const guestSessionId = crypto.randomUUID()

			await guestSessionService.create({
				id: guestSessionId,
				values: {
					locationId: null,
					favoriteIds: [],
					cartIds: [],
				},
			})

			response.cookies.set(GUEST_SESSION_ID_PARAM, guestSessionId, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 29,
				path: "/",
			})
		}
	}

	return response
}

const createRedirectUrl = (request: NextRequest) => {
	const redirectUrl = new URL("/", request.url)

	redirectUrl
		.searchParams
		.set(
			AUTH_REDIRECT_PARAM,
			request.nextUrl.pathname + request.nextUrl.search
		)

	return redirectUrl
}

export default proxy

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff|woff2|css|js)$).*)",
	],
}