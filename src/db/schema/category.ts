import { mysqlTable, varchar, timestamp, index, foreignKey, int, boolean } from "drizzle-orm/mysql-core"
import { relations } from 'drizzle-orm'

import {
	SEO_TITLE_MAX_LENGTH,
	SEO_DESCRIPTION_MAX_LENGTH,
	CATEGORY_NAME_MAX_LENGTH,
	CATEGORY_SLUG_MAX_LENGTH,
	CATEGORY_IMAGE_MAX_LENGTH,
	ID_MAX_LENGTH,
} from "@/constants"

export type CategoryTable = typeof category.$inferSelect

export const category = mysqlTable("categories", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	parentId: varchar("parent_id", { length: ID_MAX_LENGTH }),
	slug: varchar("slug", { length: CATEGORY_SLUG_MAX_LENGTH })
		.notNull()
		.unique(),
	name: varchar("name", { length: CATEGORY_NAME_MAX_LENGTH })
		.notNull(),
	image: varchar("image", { length: CATEGORY_IMAGE_MAX_LENGTH })
		.notNull(),
	sortOrder: int("sort_order")
		.notNull()
		.default(0),
	active: boolean("active")
		.notNull()
		.default(true),
	seoTitle: varchar("seo_title", { length: SEO_TITLE_MAX_LENGTH })
		.notNull(),
	seoDescription: varchar("seo_description", { length: SEO_DESCRIPTION_MAX_LENGTH })
		.notNull(),
	createdAt: timestamp("created_at", { fsp: 3 })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.notNull()
		.onUpdateNow(),
}, (table) => [
	index("category_parent_id_sort_order_idx").on(table.parentId, table.sortOrder),

	foreignKey({
		columns: [table.parentId],
		foreignColumns: [table.id],
		name: "fk_category_parent_id",
	})
		.onDelete("restrict")
])

export const categoryRelations = relations(category, (relations) => ({
	parent: relations.one(category, {
		fields: [category.parentId],
		references: [category.id],
		relationName: "category_tree",
	}),
	children: relations.many(category, {
		relationName: "category_tree",
	}),
}))