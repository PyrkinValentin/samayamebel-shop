import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { callback } from "./callback"

import {
	ID_MAX_LENGTH,
	LOCATION_NAME_MAX_LENGTH,
	LOCATION_VALUE_MAX_LENGTH,
	PHONE_NUMBER_MAX_LENGTH,
} from "@/constants"

export type LocationTable = typeof location.$inferSelect

export const location = mysqlTable("locations", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	value: varchar("value", { length: LOCATION_VALUE_MAX_LENGTH })
		.notNull()
		.unique(),
	name: varchar("name", { length: LOCATION_NAME_MAX_LENGTH })
		.notNull(),
	phoneNumber: varchar("phone_number", { length: PHONE_NUMBER_MAX_LENGTH })
		.notNull(),
	main: boolean("main")
		.notNull()
		.default(false),
})

export const locationRelations = relations(location, (relations) => ({
	callbacks: relations.many(callback),
}))