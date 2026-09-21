import { Menu } from "@cora-ui/react"
import NextLink from "next/link"
import { ShoppingBag, UserRound } from "lucide-react"

export const HeaderProfileMenuUser = () => {
	return (
		<>
			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/user/orders"/>}
			>
				<ShoppingBag/>
				Мои заказы
			</Menu.LinkItem>

			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/user/profile"/>}
			>
				<UserRound/>
				Профиль
			</Menu.LinkItem>
		</>
	)
}