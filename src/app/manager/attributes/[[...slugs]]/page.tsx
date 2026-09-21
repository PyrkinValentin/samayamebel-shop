import type { Metadata } from "next"

import { getAttributesData, Attributes } from "@/views/manager/attributes"

export const metadata: Metadata = {
	title: "Свойства",
}

type AttributesPageProps = {
	params: Promise<{ slugs?: string[] }>
}

const AttributesPage = async (props: AttributesPageProps) => {
	const { params } = props
	const { slugs } = await params

	const attributesData = await getAttributesData(slugs)

	return (
		<Attributes {...attributesData}/>
	)
}

export default AttributesPage