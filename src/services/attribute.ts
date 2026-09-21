import { createService } from "./utils"
import { schema } from "@/db"
import { asc } from "drizzle-orm"

export const Attribute = createService({
	table: schema.attribute,
	defaultOrderBy: {
		findMany: asc(schema.attribute.name),
	},
})