import { createService } from "./utils"
import { schema } from "@/db"
import { asc } from "drizzle-orm"

export const Unit = createService({
	table: schema.unit,
	defaultOrderBy: {
		findMany: asc(schema.unit.name),
	},
})