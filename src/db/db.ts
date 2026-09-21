import type { MySql2Database } from "drizzle-orm/mysql2"
import type { Pool } from "mysql2/promise"

import { createPool } from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"

import { cacheAdapter } from "./utils"
import { schema } from "./schema"

type Schema = typeof schema

const globalForDb = globalThis as unknown as {
	pool: Pool | undefined
	db: MySql2Database<Schema> | undefined
}

const pool = globalForDb.pool ?? createPool({
	uri: process.env.DATABASE_URL,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
})

export const db = globalForDb.db ?? drizzle<Schema, Pool>(pool, {
	schema,
	mode: "default",
	cache: cacheAdapter,
})

if (process.env.NODE_ENV !== "production") {
	globalForDb.pool = pool
	globalForDb.db = db
}