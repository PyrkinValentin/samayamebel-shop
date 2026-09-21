import NextLink from "next/link"
import { Button } from "@cora-ui/react"
import { LayoutGrid } from "lucide-react"

export const HeaderCatalog = () => {
	return (
		<Button
			render={<NextLink href="/catalog"/>}
			nativeButton={false}
			variant="outline"
			className="hidden sm:flex bg-surface hover:bg-neutral-soft"
		>
			<LayoutGrid className="-ms-1 size-4"/>
			Каталог товаров
		</Button>
	)
}