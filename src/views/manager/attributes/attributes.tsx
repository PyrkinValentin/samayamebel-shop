import type { AttributesData } from "./queries"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Title } from "@/components/title"
import { Empty } from "@cora-ui/react/empty"
import { CircleAlert } from "lucide-react"
import { Pagination } from "@/components/pagination"

import { AttributesToolbar } from "./attributes-toolbar"
import { AttributesItem } from "./attributes-item"

export const Attributes = (props: AttributesData) => {
	const {
		breadcrumbs,
		attributes,
		pagination,
	} = props

	const hasAttributes = pagination.total > 0

	return (
		<div className="flex flex-col gap-4">
			<Breadcrumbs breadcrumbs={breadcrumbs}/>
			<Title>Свойства</Title>
			<AttributesToolbar count={pagination.total}/>

			{hasAttributes ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						{attributes.map((attribute) => (
							<AttributesItem
								key={attribute.id}
								attribute={attribute}
							/>
						))}
					</div>

					<Pagination {...pagination}/>
				</>
			) : (
				<div className="mt-8 flex justify-center">
					<Empty.Root>
						<Empty.Icon>
							<CircleAlert/>
						</Empty.Icon>

						<Empty.Title>Список пуст</Empty.Title>
						<Empty.Description>В разделе еще не создано ни одного свойства</Empty.Description>
					</Empty.Root>
				</div>
			)}
		</div>
	)
}