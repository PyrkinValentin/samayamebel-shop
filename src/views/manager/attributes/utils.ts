import type { AttributeType } from "@/types"
import type { AttributeOptionItem } from "./types"

export const createOption = (options: AttributeOptionItem[] = []) => {
	const [minId, maxSortOrder] = options.reduce(([minId, maxSort], option) => [
		option.id < minId ? option.id : minId,
		option.sortOrder > maxSort ? option.sortOrder : maxSort,
	], [0, -1])

	return {
		id: minId - 1,
		name: "",
		description: null,
		sortOrder: maxSortOrder + 1,
	}
}

export const formatOptions = (type: AttributeType, options: AttributeOptionItem[]) => {
	if (options.length === 0) {
		return "Нет значений"
	}

	const separator = type === "text"
		? ", "
		: " × "

	return options
		.map((option) => option.name)
		.join(separator)
}