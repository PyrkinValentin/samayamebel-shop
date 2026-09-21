import type { UserItem } from "./types"

import { headers } from "next/headers"
import { auth } from "@/auth"

export type HeaderData = {
	user: UserItem | undefined
	favoriteCount: number
	cartCount: number
}

export const getHeaderData = async (): Promise<HeaderData> => {
	const headersList = await headers()

	const session = await auth.api.getSession({
		headers: headersList,
	})

	if (!session) {
		return {
			user: undefined,
			favoriteCount: 0,
			cartCount: 0,
		}
	}

	// TODO: Достать количество избранных и корзину
	const [favoriteCount, cartCount] = await Promise.all([0, 0])

	if (session.user.isAnonymous) {
		return {
			user: undefined,
			favoriteCount,
			cartCount,
		}
	}

	return {
		user: { role: session.user.role },
		favoriteCount,
		cartCount,
	}
}