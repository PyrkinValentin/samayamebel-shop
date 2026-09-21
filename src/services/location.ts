import { createService } from "./utils"
import { schema } from "@/db"
import { asc } from "drizzle-orm"

export const Location = createService({
	table: schema.location,
	defaultOrderBy: {
		findMany: asc(schema.location.name),
	},
})