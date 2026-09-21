import { createService } from "./utils"
import { schema } from "@/db"
import { asc, desc } from "drizzle-orm"

export const Callback = createService({
	table: schema.callback,
	defaultOrderBy: {
		findMany: [asc(schema.callback.status), desc(schema.callback.createdAt)],
	},
})