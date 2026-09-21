"use client"

import type { UnitItem } from "./types"

import { useTransition } from "react"

import { combineErrorsSchema, validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { removeUnitSchema } from "./schemas"
import { removeUnitAction } from "./actions"

import { AlertDialog, Button, Spinner } from "@cora-ui/react"

type UnitsItemRemoveProps = {
	unit: UnitItem
}

export const UnitsItemRemove = (props: UnitsItemRemoveProps) => {
	const { unit } = props

	const [pending, startTransition] = useTransition()

	const handleRemove = () => {
		const { errors, values } = validateSchema(removeUnitSchema, { id: unit.id })

		if (errors) {
			toast.error(combineErrorsSchema(errors))

			return
		}

		startTransition(async () => {
			try {
				const { error } = await removeUnitAction(values)

				if (error) {
					if (error.errors) toast.error(combineErrorsSchema(error.errors))
					if (error.message) toast.error(error.message)

					return
				}

				toast.success(`Ед. измерения «${unit.name}» удалена`)
			} catch {
				toast.error()
			}
		})
	}

	return (
		<AlertDialog.Actions>
			<Button
				disabled={pending}
				variant="error"
				className="w-full"
				onClick={handleRemove}
			>
				{pending
					? <Spinner/>
					: "Удалить"
				}
			</Button>
		</AlertDialog.Actions>
	)
}