"use client"

import type { PaginationRootChangeEventDetails } from "@cora-ui/react"
import type { PaginationMetadata } from "@/types"

import { usePathname, useRouter } from "next/navigation"

import { createPageHref } from "@/utils"

import { Pagination as CoraUIPagination } from "@cora-ui/react"
import NextLink from "next/link"

type PaginationProps = PaginationMetadata

export const Pagination = (props: PaginationProps) => {
	const { page, totalPages } = props

	const pathname = usePathname()
	const router = useRouter()

	const handlePageChange = (page: number, ev: PaginationRootChangeEventDetails) => {
		if (ev.reason === "page-sync") {
			router.push(createPageHref(pathname, page))
		}
	}

	const { pages, ...pageMethods } = CoraUIPagination.useManager({
		page,
		total: totalPages,
		onPageChange: handlePageChange,
	})

	return (
		<CoraUIPagination.Root
			{...pageMethods}
			size="sm"
			className="mx-auto mt-2"
		>
			<CoraUIPagination.List>
				<CoraUIPagination.Item>
					<CoraUIPagination.Prev
						nativeButton={false}
						render={
							<NextLink href={createPageHref(pathname, pageMethods.page - 1)}/>
						}
					/>
				</CoraUIPagination.Item>

				{pages.map((page) => (
					<CoraUIPagination.Item key={page}>
						{typeof page === "number" ? (
							<CoraUIPagination.Page
								nativeButton={false}
								page={page}
								render={
									<NextLink href={createPageHref(pathname, page)}/>
								}
							/>
						) : <CoraUIPagination.Ellipsis/>}
					</CoraUIPagination.Item>
				))}

				<CoraUIPagination.Item>
					<CoraUIPagination.Next
						nativeButton={false}
						render={
							<NextLink href={createPageHref(pathname, pageMethods.page + 1)}/>
						}
					/>
				</CoraUIPagination.Item>
			</CoraUIPagination.List>
		</CoraUIPagination.Root>
	)
}