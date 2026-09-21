"use client"

import type { AttributeItem } from "./types"

import { useTransition } from "react"

import { combineErrorsSchema, validateSchema } from "@/zod"
import { toast } from "@/components/toast"

import { removeAttributeSchema } from "./schemas"
import { removeAttributeAction } from "./actions"

import { AlertDialog, Button, Spinner } from "@cora-ui/react"

type AttributesItemRemoveProps = {
	attribute: AttributeItem
}

export const AttributesItemRemove = (props: AttributesItemRemoveProps) => {
	const { attribute } = props

	const [pending, startTransition] = useTransition()

	const handleRemove = () => {
		const { errors, values } = validateSchema(removeAttributeSchema, { id: attribute.id })

		if (errors) {
			toast.error(combineErrorsSchema(errors))

			return
		}

		startTransition(async () => {
			try {
				const { error } = await removeAttributeAction(values)

				if (error) {
					if (error.errors) toast.error(combineErrorsSchema(error.errors))
					if (error.message) toast.error(error.message)

					return
				}

				toast.success(`Свойство «${attribute.name}» удалено`)
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