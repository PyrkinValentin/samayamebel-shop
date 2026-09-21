import { index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { ID_MAX_LENGTH, ATTRIBUTE_OPTION_NAME_MAX_LENGTH, ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH } from "@/constants"

import { attribute } from "./attribute"

export type AttributeOptionTable = typeof attributeOption.$inferSelect

export const attributeOption = mysqlTable("attribute_options", {
	id: int("id")
		.primaryKey()
		.autoincrement(),
	attributeId: varchar("attribute_id", { length: ID_MAX_LENGTH })
		.notNull()
		.references(() => attribute.id, { onDelete: "cascade" }),
	name: varchar("name", { length: ATTRIBUTE_OPTION_NAME_MAX_LENGTH })
		.notNull(),
	description: varchar("description", { length: ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH }),
	sortOrder: int("sort_order")
		.notNull()
		.default(0),
}, (table) => [
	index("attribute_option_attribute_id_sort_order_idx").on(table.attributeId, table.sortOrder),
])

export const attributeOptionsRelations = relations(attributeOption, (relations) => ({
	attribute: relations.one(attribute, {
		fields: [attributeOption.attributeId],
		references: [attribute.id],
	}),
}))