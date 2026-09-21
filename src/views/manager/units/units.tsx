import type { UnitsData } from "./queries"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Title } from "@/components/title"
import { UnitsToolbar } from "./units-toolbar"
import { Empty } from "@cora-ui/react/empty"
import { CircleAlert } from "lucide-react"

import { UnitsItem } from "./units-item"

export const Units = (props: UnitsData) => {
	const { breadcrumbs, units } = props

	const hasUnits = units.length > 0

	return (
		<div className="flex flex-col gap-4">
			<Breadcrumbs breadcrumbs={breadcrumbs}/>
			<Title>Единицы измерения</Title>
			<UnitsToolbar count={units.length}/>

			{hasUnits ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
					{units.map((unit) => (
						<UnitsItem
							key={unit.id}
							unit={unit}
						/>
					))}
				</div>
			) : (
				<div className="mt-8 flex justify-center">
					<Empty.Root>
						<Empty.Icon>
							<CircleAlert/>
						</Empty.Icon>

						<Empty.Title>Список пуст</Empty.Title>
						<Empty.Description>В разделе еще не создано ни одной единицы измерения</Empty.Description>
					</Empty.Root>
				</div>
			)}
		</div>
	)
}