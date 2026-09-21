import { mysqlTable, varchar, timestamp, text, index, int, boolean } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

import { user } from "./user"

import { ID_MAX_LENGTH } from "@/constants"

export const account = mysqlTable("accounts", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	accountId: text("account_id")
		.notNull(),
	providerId: text("provider_id")
		.notNull(),
	userId: varchar("userId", { length: ID_MAX_LENGTH })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at", { fsp: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.notNull()
		.onUpdateNow(),
}, (table) => [
	index("account_user_id_idx").on(table.userId),
])

export const passkey = mysqlTable("passkeys", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	name: text("name"),
	publicKey: text("public_key")
		.notNull(),
	userId: varchar("user_id", { length: ID_MAX_LENGTH })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	credentialID: varchar("credential_id", { length: 255 })
		.notNull(),
	counter: int("counter")
		.notNull(),
	deviceType: text("device_type")
		.notNull(),
	backedUp: boolean("backed_up")
		.notNull(),
	transports: text("transports"),
	createdAt: timestamp("created_at", { fsp: 3 }),
	aaguid: text("aaguid"),
}, (table) => [
	index("passkey_user_id_idx").on(table.userId),
	index("passkey_credential_id_idx").on(table.credentialID),
])

export const session = mysqlTable("sessions", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	expiresAt: timestamp("expires_at", { fsp: 3 })
		.notNull(),
	token: varchar("token", { length: 255 })
		.notNull()
		.unique(),
	createdAt: timestamp("created_at", { fsp: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.notNull()
		.onUpdateNow(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: varchar("user_id", { length: ID_MAX_LENGTH })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
	index("session_user_id_idx").on(table.userId),
])

export const verification = mysqlTable("verifications", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	identifier: varchar("identifier", { length: 255 })
		.notNull(),
	value: text("value")
		.notNull(),
	expiresAt: timestamp("expires_at", { fsp: 3 })
		.notNull(),
	createdAt: timestamp("created_at", { fsp: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.notNull()
		.onUpdateNow(),
}, (table) => [
	index("verification_identifier_idx").on(table.identifier),
])

export const accountRelations = relations(account, (relations) => ({
	user: relations.one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}))

export const passkeyRelations = relations(passkey, (relations) => ({
	user: relations.one(user, {
		fields: [passkey.userId],
		references: [user.id],
	}),
}))

export const sessionRelations = relations(session, (relations) => ({
	user: relations.one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))