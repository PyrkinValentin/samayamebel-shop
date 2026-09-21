import type { Breadcrumb } from "@/types"

type Item = {
	slug: string
	name: string
}

type CreateBreadcrumbsOptions = {
	slugs?: string[]
	items?: Item[]
}

export const createBreadcrumbs = (options: CreateBreadcrumbsOptions): Breadcrumb[] => {
	const {
		slugs = [],
		items = [],
	} = options

	const itemsMap = new Map(items.map((item) => [item.slug, item.name]))
	const result: Breadcrumb[] = []

	let currentHref = ""

	for (const slug of slugs) {
		currentHref = `${currentHref}/${slug}`

		const name = itemsMap.get(slug)

		if (name) {
			result.push({
				href: currentHref,
				name,
				last: false,
			})
		}
	}

	if (result.length > 0) {
		result[result.length - 1].last = true
	}

	return result
}