import NextLink from "next/link"
import { Badge, Button } from "@cora-ui/react"
import { Heart } from "lucide-react"

type HeaderFavoritesProps = {
	count: number
}

export const HeaderFavorites = (props: HeaderFavoritesProps) => {
	const { count } = props

	const hasFavorites = count > 0

	return (
		<Badge.Root>
			<Button
				iconOnly
				nativeButton={false}
				variant="ghost"
				aria-label="Избранное"
				render={<NextLink href="/favorites"/>}
			>
				<Heart className="size-5"/>
			</Button>

			<Badge.Indicator
				invisible={!hasFavorites}
				size="sm"
				className="bg-foreground text-background"
			>
				{count}
			</Badge.Indicator>
		</Badge.Root>
	)
}