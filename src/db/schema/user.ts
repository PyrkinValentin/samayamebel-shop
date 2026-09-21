import { mysqlTable, varchar, timestamp, mysqlEnum, boolean, text } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { account, session } from "./auth"

import {
	ID_MAX_LENGTH,
	PHONE_NUMBER_MAX_LENGTH,
	USER_EMAIL_MAX_LENGTH,
	USER_NAME_MAX_LENGTH,
	USER_ROLES,
} from "@/constants"

export type UserTable = typeof user.$inferSelect

export const user = mysqlTable("users", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	role: mysqlEnum("role", USER_ROLES)
		.notNull()
		.default("user"),
	phoneNumber: varchar("phone_number", { length: PHONE_NUMBER_MAX_LENGTH })
		.unique(),
	phoneNumberVerified: boolean("phone_number_verified")
		.notNull()
		.default(false),
	email: varchar("email", { length: USER_EMAIL_MAX_LENGTH })
		.notNull()
		.unique(),
	emailVerified: boolean("email_verified")
		.notNull()
		.default(false),
	name: varchar("name", { length: USER_NAME_MAX_LENGTH })
		.notNull(),
	image: text("image"),
	isAnonymous: boolean("is_anonymous")
		.notNull()
		.default(false),
	createdAt: timestamp("created_at", { fsp: 3 })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.notNull()
		.onUpdateNow(),
})

export const userRelations = relations(user, (relations) => ({
	accounts: relations.many(account),
	sessions: relations.many(session),
}))