"use server"

import { headers } from "next/headers"
import { requireAuth } from "@/auth"
import { validateSchema } from "@/zod"
import { db } from "@/db"
import { Attribute, AttributeOption } from "@/services"
import { eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { createAttributeSchema, updateAttributeSchema, removeAttributeSchema } from "./schemas"

export const createAttributeAction = async (data: unknown) => {
	await requireAuth(await headers(), "manager")

	const { errors, values } = validateSchema(createAttributeSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { name, type, options } = values

	const attribute = await Attribute.findOne({
		fields: { id: Attribute.id },
		where: eq(Attribute.name, name),
	})

	if (attribute) {
		return {
			error: {
				errors: { name: "Такое наименование уже есть" },
			},
		}
	}

	await db.transaction(async (tx) => {
		const [createdAttribute] = await Attribute.create({
			tx,
			values: { type, name },
		})

		if (options.length > 0) {
			await AttributeOption.create({
				tx,
				values: options.map((attributeOption) => ({
					...attributeOption,
					attributeId: createdAttribute.id,
				})),
			})
		}
	})

	revalidatePath("/manager/attributes")

	return {
		data: {},
	}
}

export const updateAttributeAction = async (data: unknown) => {
	await requireAuth(await headers(), "manager")

	const { errors, values } = validateSchema(updateAttributeSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id, type, name, options } = values

	const attribute = await Attribute.findOne({
		fields: { id: Attribute.id },
		where: eq(Attribute.id, id),
	})

	if (!attribute) {
		return {
			error: { message: "Свойство не найдено или удалено" },
		}
	}

	const attributeOptions = await AttributeOption.findMany({
		fields: {
			id: AttributeOption.id,
			name: AttributeOption.name,
		},
		where: eq(AttributeOption.attributeId, id),
	})

	const deletedOptionIds = attributeOptions
		.filter((option) => !options.some((o) => option.id === o.id))
		.map((option) => option.id)

	const cantDeletedOptionIds: number[] = []

	if (deletedOptionIds.length > 0) {
		// TODO: Достать все id опций с помощью deletedOptionIds которые используются в спецйификациях
	}

	if (cantDeletedOptionIds.length > 0) {
		const cantDeletedOptions = attributeOptions
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
		await Attribute.update({
			tx,
			values: { type, name },
			where: eq(Attribute.id, id),
		})

		if (optionsToCreateOrUpdate.length > 0) {
			await AttributeOption.upsert({
				tx,
				values: optionsToCreateOrUpdate,
				set: {
					name: sql`VALUES (name)`,
					description: sql`VALUES (description)`,
					sortOrder: sql`VALUES (sort_order)`,
				},
			})
		}

		if (optionsIdsToDelete.length > 0) {
			await AttributeOption.remove({
				tx,
				where: inArray(AttributeOption.id, optionsIdsToDelete),
			})
		}
	})

	revalidatePath("/manager/attributes")

	return {
		data: {},
	}
}

export const removeAttributeAction = async (data: unknown) => {
	await requireAuth(await headers(), "manager")

	const { errors, values } = validateSchema(removeAttributeSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id } = values


	const attribute = await Attribute.findOne({
		fields: { id: Attribute.id },
		where: eq(Attribute.id, id),
	})

	if (!attribute) {
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

	await Attribute.remove({
		where: eq(Attribute.id, id),
	})

	revalidatePath("/manager/attributes")

	return {
		data: {},
	}
}