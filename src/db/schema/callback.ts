import { mysqlTable, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { location } from "./location"

import { CALLBACK_STATUSES, ID_MAX_LENGTH, PHONE_NUMBER_MAX_LENGTH, USER_NAME_MAX_LENGTH } from "@/constants"

export type CallbackTable = typeof callback.$inferSelect

export const callback = mysqlTable("callbacks", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	locationId: varchar("location_id", { length: ID_MAX_LENGTH })
		.references(() => location.id, { onDelete: "set null" }),
	status: mysqlEnum("status", CALLBACK_STATUSES)
		.notNull()
		.default("pending"),
	name: varchar("name", { length: USER_NAME_MAX_LENGTH })
		.notNull(),
	phoneNumber: varchar("phone_number", { length: PHONE_NUMBER_MAX_LENGTH })
		.notNull(),
	createdAt: timestamp("created_at", { fsp: 3 })
		.notNull()
		.defaultNow(),
})

export const callbackRelations = relations(callback, (relations) => ({
	location: relations.one(location, {
		fields: [callback.locationId],
		references: [location.id],
	}),
}))