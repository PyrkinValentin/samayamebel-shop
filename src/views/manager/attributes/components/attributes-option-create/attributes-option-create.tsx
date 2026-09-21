"use client"

import type { AttributeOptionItem } from "../../types"

import { createOption } from "../../utils"

import { Button } from "@cora-ui/react"
import { Plus } from "lucide-react"

type AttributesOptionCreateProps = {
	options: AttributeOptionItem[]
	onOptionsChange: (options: AttributeOptionItem[]) => void
}

export const AttributesOptionCreate = (props: AttributesOptionCreateProps) => {
	const { options, onOptionsChange } = props

	const handleOptionCreate = () => {
		onOptionsChange([...options, createOption(options)])
	}

	return (
		<>
			<span className="text-sm">Значения</span>

			<Button
				variant="outline"
				size="sm"
				onClick={handleOptionCreate}
			>
				<Plus/> Добавить
			</Button>
		</>
	)
}