import { createService } from "./utils"
import { schema } from "@/db"
import { asc } from "drizzle-orm"

export const AttributeOption = createService({
	table: schema.attributeOption,
	defaultOrderBy: {
		findMany: asc(schema.attributeOption.sortOrder),
	},
})