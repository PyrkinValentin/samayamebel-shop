const extractBasePathWithoutPage = (pathname: string | undefined | null) => {
	if (!pathname || pathname === "/") {
		return "/"
	}

	const segments = pathname
		.split("/")
		.filter(Boolean)

	if (segments.length === 0) {
		return "/"
	}

	const lastSegment = segments[segments.length - 1]

	if (lastSegment.startsWith("page-")) {
		return "/" + segments.slice(0, -1).join("/")
	}

	return pathname.startsWith("/")
		? pathname
		: `/${pathname}`
}

export const createPageHref = (pathname: string, pageNumber: number): string => {
	const basePath = extractBasePathWithoutPage(pathname)

	return pageNumber === 1
		? basePath
		: `${basePath}/page-${pageNumber}`
}