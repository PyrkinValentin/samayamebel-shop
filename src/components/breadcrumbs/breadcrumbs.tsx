import type { Breadcrumb } from "@/types"

import { Fragment } from "react"
import { Breadcrumbs as CoraUIBreadcrumbs } from "@cora-ui/react"
import NextLink from "next/link"

type BreadcrumbsProps = {
	breadcrumbs: Breadcrumb[]
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
	const { breadcrumbs } = props

	if (breadcrumbs.length === 0) {
		return null
	}

	return (
		<CoraUIBreadcrumbs.Root>
			<CoraUIBreadcrumbs.List>
				{breadcrumbs.map((breadcrumb) => (
					<Fragment key={breadcrumb.id}>
						<CoraUIBreadcrumbs.Item className="whitespace-nowrap">
							{!breadcrumb.last ? (
								<CoraUIBreadcrumbs.Link
									render={
										<NextLink href={breadcrumb.href}/>
									}
								>
									{breadcrumb.name}
								</CoraUIBreadcrumbs.Link>
							) : (
								<CoraUIBreadcrumbs.Page>{breadcrumb.name}</CoraUIBreadcrumbs.Page>
							)}
						</CoraUIBreadcrumbs.Item>

						{!breadcrumb.last && <CoraUIBreadcrumbs.Separator/>}
					</Fragment>
				))}
			</CoraUIBreadcrumbs.List>
		</CoraUIBreadcrumbs.Root>
	)
}