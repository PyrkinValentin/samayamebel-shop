import { mysqlTable, varchar } from "drizzle-orm/mysql-core"

import { ID_MAX_LENGTH, UNIT_NAME_MAX_LENGTH, UNIT_SHORT_NAME_MAX_LENGTH } from "@/constants"

export type UnitTable = typeof unit.$inferSelect

export const unit = mysqlTable("units", {
	id: varchar("id", { length: ID_MAX_LENGTH })
		.primaryKey()
		.$defaultFn(crypto.randomUUID),
	shortName: varchar("short_name", { length: UNIT_SHORT_NAME_MAX_LENGTH })
		.notNull()
		.unique(),
	name: varchar("name", { length: UNIT_NAME_MAX_LENGTH })
		.notNull()
		.unique(),
})