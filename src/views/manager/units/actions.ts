"use server"

import { headers } from "next/headers"
import { requireAuth } from "@/auth"
import { validateSchema } from "@/zod"
import { Unit } from "@/services"
import { and, eq, not, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { createUnitSchema, updateUnitSchema, removeUnitSchema } from "./schemas"

export const createUnitAction = async (data: unknown) => {
	await requireAuth(await headers(), "manager")

	const { errors, values } = validateSchema(createUnitSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { shortName, name } = values

	const duplicateUnit = await Unit.findOne({
		fields: {
			shortName: Unit.shortName,
			name: Unit.name,
		},
		where: or(
			eq(Unit.shortName, shortName),
			eq(Unit.name, name),
		),
	})

	if (duplicateUnit) {
		const shortNameDuplicate = duplicateUnit.shortName.toLowerCase() === shortName.toLowerCase()
		const nameDuplicate = duplicateUnit.name.toLowerCase() === name.toLowerCase()

		return {
			error: {
				errors: {
					...(shortNameDuplicate
							? { shortName: "Такое сокращение уже используется" }
							: undefined
					),
					...(nameDuplicate
							? { name: "Такое наименование уже зарегистрировано" }
							: undefined
					),
				},
			},
		}
	}

	await Unit.create({
		values: { shortName, name },
	})

	revalidatePath("/manager/units")

	return {
		data: {},
	}
}

export const updateUnitAction = async (data: unknown) => {
	await requireAuth(await headers(), "manager")

	const { errors, values } = validateSchema(updateUnitSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id, shortName, name } = values

	const unit = await Unit.findOne({
		fields: { id: Unit.id },
		where: eq(Unit.id, id),
	})

	if (!unit) {
		return {
			error: { message: "Ед. измерения не найдена или удалена" },
		}
	}

	const duplicateUnit = await Unit.findOne({
		fields: {
			shortName: Unit.shortName,
			name: Unit.name,
		},
		where: and(
			not(eq(Unit.id, id)),
			or(
				eq(Unit.shortName, shortName),
				eq(Unit.name, name),
			),
		),
	})

	if (duplicateUnit) {
		const shortNameDuplicate = duplicateUnit.shortName.toLowerCase() === shortName.toLowerCase()
		const nameDuplicate = duplicateUnit.name.toLowerCase() === name.toLowerCase()

		return {
			error: {
				errors: {
					...(shortNameDuplicate
							? { shortName: "Такое сокращение уже используется" }
							: undefined
					),
					...(nameDuplicate
							? { name: "Такое наименование уже зарегистрировано" }
							: undefined
					),
				},
			},
		}
	}

	await Unit.update({
		values: { shortName, name },
		where: eq(Unit.id, id),
	})

	revalidatePath("/manager/units")

	return {
		data: {},
	}
}

export const removeUnitAction = async (data: unknown) => {
	await requireAuth(await headers(), "manager")

	const { errors, values } = validateSchema(removeUnitSchema, data)

	if (errors) {
		return {
			error: { errors },
		}
	}

	const { id } = values

	const unit = await Unit.findOne({
		fields: { id: Unit.id },
		where: eq(Unit.id, id)
	})

	if (!unit) {
		return {
			error: { message: "Ед. измерения не найдена или удалена" },
		}
	}

	// TODO: Узнать используется ли спецификации и товары у юнита.
	const hasSpecifications = false

	if (hasSpecifications) {
		return {
			error: { message: "Удаление невозможно. Ед. измерения используется в спецификациях" }
		}
	}

	await Unit.remove({
		where: eq(Unit.id, id)
	})

	revalidatePath("/manager/units")

	return {
		data: {},
	}
}