import type { NextRequest } from "next/server"

import { NextResponse } from "next/server"
import { auth } from "@/auth"

import { AUTH_REDIRECT_PARAM } from "@/constants"

const proxy = async (request: NextRequest) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	})

	if (!session || session.user.isAnonymous) {
		return NextResponse.redirect(createRedirectUrl(request))
	}

	const targetRole = request
		.nextUrl
		.pathname
		.split("/")
		.filter(Boolean)
		.at(0)

	return targetRole && targetRole !== session.user.role
		? NextResponse.rewrite(new URL("/404", request.url))
		: NextResponse.next()
}

const createRedirectUrl = (request: NextRequest) => {
	const redirectUrl = new URL("/", request.url)

	redirectUrl
		.searchParams
		.set(AUTH_REDIRECT_PARAM, request.nextUrl.pathname + request.nextUrl.search)

	return redirectUrl
}

export default proxy

export const config = {
	matcher: [
		"/manager/:path*",
		"/user/:path*",
	],
}