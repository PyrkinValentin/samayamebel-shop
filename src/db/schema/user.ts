import { mysqlTable, varchar, timestamp, mysqlEnum, boolean, int } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { account } from "./account"
import { session } from "./session"

import { USER_PHONE_NUMBER_MAX_LENGTH, USER_NAME_MAX_LENGTH, USER_ROLES } from "@/constants"

export type CreateUserDB = typeof user.$inferInsert
export type UserDB = typeof user.$inferSelect

export const user = mysqlTable("users", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	role: mysqlEnum("role", USER_ROLES)
		.notNull()
		.default("user"),
	phoneNumber: varchar("phone_number", { length: USER_PHONE_NUMBER_MAX_LENGTH })
		.notNull()
		.unique()
		.$defaultFn(() => crypto.randomUUID().slice(0, USER_PHONE_NUMBER_MAX_LENGTH)),
	phoneNumberVerified: boolean("phone_number_verified")
		.notNull()
		.default(false),
	email: varchar("email", { length: 255 })
		.notNull(),
	emailVerified: boolean("email_verified")
		.notNull()
		.default(false),
	name: varchar("name", { length: USER_NAME_MAX_LENGTH })
		.notNull()
		.default(""),
	bonus: int("bonus", { unsigned: true })
		.notNull()
		.default(0),
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