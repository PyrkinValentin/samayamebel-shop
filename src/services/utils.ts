import type { Placeholder, SQL } from "drizzle-orm"
import type { MySqlTable } from "drizzle-orm/mysql-core/table"
import type { MySqlRawQueryResult } from "drizzle-orm/mysql2"
import type { MySqlUpdateSetSource, SelectedFields } from "drizzle-orm/mysql-core"
import type { MySqlColumn } from "drizzle-orm/mysql-core/columns"
import type { DbTransaction } from "./types"

import { db } from "@/db"
import { count as drizzleCount } from "drizzle-orm"
import { ensureArray } from "@/utils"

import { PAGINATION_PER_PAGE } from "@/constants"

type CreateServiceOptions<Table extends MySqlTable> = {
	table: Table
	defaultOrderBy?: {
		findMany?: MySqlColumn | SQL | SQL.Aliased | (MySqlColumn | SQL | SQL.Aliased)[]
	}
}

type InferInsert<Table extends MySqlTable> = Table["$inferInsert"]
type InferSelect<Table extends MySqlTable> = Table["$inferSelect"]
type Columns<Table extends MySqlTable> = Table["_"]["columns"]

type CreateOptions<Table extends MySqlTable, Values extends InferInsert<Table> | InferInsert<Table>[]> = {
	tx?: DbTransaction
	values: Values
}

type CreateReturn<Table extends MySqlTable, Values extends InferInsert<Table> | InferInsert<Table>[]> = Values extends InferInsert<Table>[]
	? Promise<MySqlRawQueryResult>
	: Promise<{ id: InferSelect<Table>["id"] }[]>

type UpdateOptions<Table extends MySqlTable> = {
	tx?: DbTransaction
	values: Partial<InferSelect<Table>> | Partial<InferSelect<Table>>[]
	where?: SQL
	limit?: number | Placeholder
}

type UpsertOptions<Table extends MySqlTable> = {
	tx?: DbTransaction
	values: InferInsert<Table> | InferInsert<Table>[]
	set: MySqlUpdateSetSource<never>
}

type RemoveOptions = {
	tx?: DbTransaction
	where?: SQL
	limit?: number | Placeholder
}

type CountOptions<Selection extends SelectedFields> = {
	tx?: DbTransaction
	fields?: Selection
	where?: SQL
}

type FindOneOptions<Table extends MySqlTable, Selection extends SelectedFields = Columns<Table>> = {
	tx?: DbTransaction
	fields?: Selection
	where?: SQL
}

type FindManyOptions<Table extends MySqlTable, Selection extends SelectedFields = Columns<Table>> = {
	tx?: DbTransaction
	fields?: Selection
	where?: SQL
	orderBy?: MySqlColumn | SQL | SQL.Aliased | (MySqlColumn | SQL | SQL.Aliased)[]
	groupBy?: MySqlColumn | SQL | SQL.Aliased | (MySqlColumn | SQL | SQL.Aliased)[]
	limit?: number | Placeholder
	offset?: number | Placeholder
}

type FindManyPaginatedOptions<Table extends MySqlTable, Selection extends SelectedFields = Columns<Table>> =
	Omit<FindManyOptions<Table, Selection>, "limit" | "offset">
	& { page?: number }

export const createService = <Table extends MySqlTable>(options: CreateServiceOptions<Table>) => {
	const { table, defaultOrderBy } = options

	const create = <Values extends InferInsert<Table> | InferInsert<Table>[]>(options: CreateOptions<Table, Values>): CreateReturn<Table, Values> => {
		const { tx = db, values } = options

		if (Array.isArray(values))
			return tx
				.insert(table)
				.values(values) as never

		return tx
			.insert(table)
			.values(values)
			.$returningId() as never
	}

	const update = (options: UpdateOptions<Table>) => {
		const { tx = db, values, where, limit = 100 } = options

		return tx
			.update(table)
			.set(values)
			.where(where)
			.limit(limit)
	}

	const upsert = (options: UpsertOptions<Table>): Promise<MySqlRawQueryResult> => {
		const { tx = db, values, set } = options
		
		return tx
			.insert(table)
			.values(values as Table)
			.onDuplicateKeyUpdate({ set })
	}

	const remove = (options: RemoveOptions = {}) => {
		const { tx = db, where, limit = 100 } = options

		return tx
			.delete(table)
			.where(where)
			.limit(limit)
	}

	const count = async <Selection extends SelectedFields>(options: CountOptions<Selection> = {}) => {
		const { tx = db, fields, where } = options

		const query = tx
			.select({
				count: drizzleCount(),
				...fields,
			})
			.from(table)
			.$withCache()
			.$dynamic()

		if (where) query.where(where)

		const result = await query

		return result.at(0) as Awaited<ReturnType<typeof query.execute>>[number]
	}

	const findOne = async <Selection extends SelectedFields = Columns<Table>>(options: FindOneOptions<Table, Selection> = {}) => {
		const { tx = db, fields, where } = options

		const query = tx
			.select(fields as Selection)
			.from(table)
			.$withCache()
			.$dynamic()

		if (where) query.where(where)

		query.limit(1)

		const result = await query

		return result.at(0) as Awaited<ReturnType<typeof query.execute>>[number] | undefined
	}

	const findMany = <Selection extends SelectedFields = Columns<Table>>(options: FindManyOptions<Table, Selection> = {}) => {
		const { tx = db, fields, where, orderBy, groupBy, limit, offset } = options

		const query = tx
			.select(fields as Selection)
			.from(table)
			.$withCache()
			.$dynamic()

		if (where) query.where(where)

		query.orderBy(...ensureArray(orderBy ?? defaultOrderBy?.findMany))

		if (groupBy) query.groupBy(...ensureArray(groupBy))
		if (limit) query.limit(limit)
		if (offset) query.offset(offset)

		return query
	}

	const findManyPaginated = async <Selection extends SelectedFields = Columns<Table>>(options: FindManyPaginatedOptions<Table, Selection> = {}) => {
		const { tx, page = 1, fields, where, orderBy } = options

		const total = await count({ tx, where })
		const paginationMeta = getPaginationMeta(page, PAGINATION_PER_PAGE, total.count)

		const pagination = {
			page: paginationMeta.page,
			total: paginationMeta.total,
			totalPages: paginationMeta.totalPages,
		}

		if (paginationMeta.outOfRange) {
			return {
				rows: [] as typeof rows,
				pagination,
			}
		}

		const rows = await findMany({
			tx,
			fields,
			where,
			orderBy,
			limit: paginationMeta.limit,
			offset: paginationMeta.offset,
		})

		return {
			rows,
			pagination,
		}
	}

	return {
		create,
		update,
		upsert,
		remove,
		count,
		findOne,
		findMany,
		findManyPaginated,
		...table,
	} as const
}

const getPaginationMeta = (page: number, limit: number, totalItems: number) => {
	const localLimit = Math.max(1, limit)
	const localPage = Math.max(1, page)
	const total = Math.max(0, totalItems)
	const offset = (localPage - 1) * localLimit
	const totalPages = Math.ceil(total / localLimit) || 1
	const outOfRange = offset >= total

	return {
		page: localPage,
		offset,
		limit: localLimit,
		total,
		totalPages,
		outOfRange,
	}
}