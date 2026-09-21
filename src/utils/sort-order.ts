type Item = { sortOrder: number }

export const reindexSortOrder = <T extends Item>(items: T[]): T[] => {
	return items.map((item, index) => ({ ...item, sortOrder: index }))
}