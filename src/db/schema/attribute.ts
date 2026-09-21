import { mysqlTable, varchar, mysqlEnum } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { ID_MAX_LENGTH, ATTRIBUTE_NAME_MAX_LENGTH, ATTRIBUTE_TYPES } from "@/constants"

import { attributeOption } from "./attribute-option"

export type AttributeTable = typeof attribute.$inferSelect

export const attribute = mysqlTable("attributes", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	type: mysqlEnum("type", ATTRIBUTE_TYPES)
		.notNull(),
	name: varchar("name", { length: ATTRIBUTE_NAME_MAX_LENGTH })
		.notNull()
		.unique(),
})

export const attributeRelations = relations(attribute, (relations) => ({
	options: relations.many(attributeOption),
}))