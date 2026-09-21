import type { NextRequest } from "next/server"

import { requireAuth } from "@/auth"
import { eq } from "drizzle-orm"
import { Callback } from "@/services"

export const GET = async (request: NextRequest) => {
	await requireAuth(request.headers, "manager")

	// TODO: Достать количество необработанных заказов
	const totalCountOrders = 0

	const callback = await Callback.count({
		where: eq(Callback.status, "pending"),
	})

	return Response.json({
		totalCountOrders,
		totalCountCallbacks: callback.count,
	})
}