export const ensureArray = <T>(value?: T | T[] | undefined, ...fallbacks: T[]) => {
	if (!value) return fallbacks

	return Array.isArray(value)
		? [...value, ...fallbacks]
		: [value, ...fallbacks]
}