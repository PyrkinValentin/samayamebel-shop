"use server"

import { headers } from "next/headers"
import { auth } from "@/auth"
import { validateSchema } from "@/utils"
import { db, schema } from "@/db"
import { invalidateCache } from "@/cache"
import { eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { ATTRIBUTE_CACHE_KEY } from "@/constants"

import { createAttributeSchema, updateAttributeSchema, removeAttributeSchema } from "./schemas"

export const createAttributeAction = async (data: unknown) => {
	const headersList = await headers()

	const session = await auth.api.getSession({
		headers: headersList,
		query: {
			disableCookieCache: true,
		},
	})

	if (!session || session.user.role !== "manager") {
		return {
			error: { message: "Доступ запрещен. У вас нет прав для выполнения этого действия" },
		}
	}

	const { errors, values } = validateSchema(createAttributeSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { name, type, options } = values

	const attributes = await db
		.select({ id: schema.attribute.id })
		.from(schema.attribute)
		.where(eq(schema.attribute.name, name))
		.limit(1)

	const hasAttribute = attributes.length > 0

	if (hasAttribute) {
		return {
			error: {
				errors: { name: "Такое наименование уже есть" },
			},
		}
	}

	await db.transaction(async (tx) => {
		const [createdAttribute] = await tx
			.insert(schema.attribute)
			.values({ type, name })
			.$returningId()

		if (options.length > 0) {
			const attributeOptions = options.map((attributeOption) => ({
				...attributeOption,
				attributeId: createdAttribute.id,
			}))

			await tx
				.insert(schema.attributeOption)
				.values(attributeOptions)
		}
	})

	await invalidateCache(ATTRIBUTE_CACHE_KEY)

	revalidatePath("/manager/attributes", "layout")

	return {
		data: {},
	}
}

export const updateAttributeAction = async (data: unknown) => {
	const headersList = await headers()

	const session = await auth.api.getSession({
		headers: headersList,
		query: {
			disableCookieCache: true,
		},
	})

	if (!session || session.user.role !== "manager") {
		return {
			error: { message: "Доступ запрещен. У вас нет прав для выполнения этого действия" },
		}
	}

	const { errors, values } = validateSchema(updateAttributeSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id, type, name, options } = values

	const attributes = await db
		.select({ id: schema.attribute.id })
		.from(schema.attribute)
		.where(eq(schema.attribute.id, id))
		.limit(1)

	const hasAttribute = attributes.length > 0

	if (!hasAttribute) {
		return {
			error: { message: "Свойство не найдено или удалено" },
		}
	}

	const optionsRaw = await db
		.select({
			id: schema.attributeOption.id,
			name: schema.attributeOption.name,
		})
		.from(schema.attributeOption)
		.where(eq(schema.attributeOption.attributeId, id))

	const deletedOptionIds = optionsRaw
		.filter((option) => !options.some((o) => option.id === o.id))
		.map((option) => option.id)

	const cantDeletedOptionIds: number[] = []

	if (deletedOptionIds.length > 0) {
		// TODO: Достать все id опций с помощью deletedOptionIds которые используются в спецйификациях
	}

	if (cantDeletedOptionIds.length > 0) {
		const cantDeletedOptions = optionsRaw
			.filter((option) => option.id && cantDeletedOptionIds.includes(option.id))
			.map((option) => option.name)

		return {
			error: {
				message: `Невозможно удалить значения: ${cantDeletedOptions.join(", ")}. Используются в спецификациях`,
			},
		}
	}

	const optionsToCreateOrUpdate = options
		.map((option) => ({ ...option, attributeId: id }))

	const optionsIdsToDelete = deletedOptionIds
		.filter((id) => !cantDeletedOptionIds.includes(id))

	await db.transaction(async (tx) => {
		await tx
			.update(schema.attribute)
			.set({ type, name })
			.where(eq(schema.attribute.id, id))

		if (optionsToCreateOrUpdate.length > 0) {
			await tx
				.insert(schema.attributeOption)
				.values(optionsToCreateOrUpdate)
				.onDuplicateKeyUpdate({
					set: {
						name: sql`VALUES (name)`,
						description: sql`VALUES (description)`,
						sortOrder: sql`VALUES (sort_order)`,
					},
				})
		}

		if (optionsIdsToDelete.length > 0) {
			await tx
				.delete(schema.attributeOption)
				.where(inArray(schema.attributeOption.id, optionsIdsToDelete))
		}
	})

	await invalidateCache(ATTRIBUTE_CACHE_KEY)

	revalidatePath("/manager/attributes", "layout")

	return {
		data: {},
	}
}

export const removeAttributeAction = async (data: unknown) => {
	const headersList = await headers()

	const session = await auth.api.getSession({
		headers: headersList,
		query: {
			disableCookieCache: true,
		},
	})

	if (!session || session.user.role !== "manager") {
		return {
			error: { message: "Доступ запрещен. У вас нет прав для выполнения этого действия" },
		}
	}

	const { errors, values } = validateSchema(removeAttributeSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id } = values

	const attributes = await db
		.select({ id: schema.attribute.id })
		.from(schema.attribute)
		.where(eq(schema.attribute.id, id))
		.limit(1)

	const hasAttribute = attributes.length > 0

	if (!hasAttribute) {
		return {
			error: { message: "Свойство не найдено или удалено" },
		}
	}

	// TODO: Узнать используется ли спецификации и товары у атрибута.
	const hasSpecifications = false

	if (hasSpecifications) {
		return {
			error: { message: "Удаление невозможно. Свойство используется в спецификациях" }
		}
	}

	await db
		.delete(schema.attribute)
		.where(eq(schema.attribute.id, id))

	await invalidateCache(ATTRIBUTE_CACHE_KEY)

	revalidatePath("/manager/attributes", "layout")

	return {
		data: {},
	}
}