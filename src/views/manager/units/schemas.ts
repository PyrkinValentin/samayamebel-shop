import { Z, z } from "@/zod"

export const createUnitSchema = z.object({
	shortName: Z.unit.shortName,
	name: Z.unit.name,
})

export const updateUnitSchema = z.object({
	id: Z.uuid,
	shortName: Z.unit.shortName,
	name: Z.unit.name,
})

export const removeUnitSchema = z.object({
	id: Z.uuid,
})