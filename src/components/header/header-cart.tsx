import NextLink from "next/link"
import { Badge, Button } from "@cora-ui/react"
import { ShoppingBag } from "lucide-react"

type HeaderCartProps = {
	count: number
}

export const HeaderCart = (props: HeaderCartProps) => {
	const { count } = props

	const hasCart = count > 0

	return (
		<Badge.Root>
			<Button
				iconOnly
				nativeButton={false}
				variant="ghost"
				aria-label="Корзина"
				render={<NextLink href="/cart"/>}
			>
				<ShoppingBag className="size-5"/>
			</Button>

			<Badge.Indicator
				invisible={!hasCart}
				size="sm"
				className="bg-foreground text-background"
			>
				{count}
			</Badge.Indicator>
		</Badge.Root>
	)
}