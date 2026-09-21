import { PAGINATION_PREFIX_PAGE } from "@/constants"

export const extractPageFromSlugs = (slugs: string[] | undefined) => {
	if (!slugs?.length) {
		return { page: 1, valid: true }
	}

	const lastSlug = slugs.at(-1)

	if (lastSlug?.startsWith(PAGINATION_PREFIX_PAGE)) {
		const parsedPage = Number(lastSlug.slice(PAGINATION_PREFIX_PAGE.length))

		const valid = parsedPage >= 1 &&
			!isNaN(parsedPage) &&
			Number.isInteger(parsedPage)

		const page = valid
			? parsedPage
			: 1

		return { page, valid }
	}

	return { page: 1, valid: true }
}