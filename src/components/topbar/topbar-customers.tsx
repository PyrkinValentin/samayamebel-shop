import NextLink from "next/link"
import { Menu } from "@cora-ui/react"
import { ChevronDown } from "lucide-react"

export const TopbarCustomers = () => {
	return (
		<Menu.Root>
			<Menu.Trigger className="flex items-center gap-2 text-xs">
				Покупателям
				<ChevronDown className="size-3.5 text-muted"/>
			</Menu.Trigger>

			<Menu.Portal>
				<Menu.Positioner>
					<Menu.Popup>
						<Menu.Arrow/>

						<Menu.LinkItem
							closeOnClick
							render={<NextLink href="/about"/>}
						>
							О нас
						</Menu.LinkItem>

						<Menu.LinkItem
							closeOnClick
							render={<NextLink href="/order"/>}
						>
							Оплата
						</Menu.LinkItem>

						<Menu.LinkItem
							closeOnClick
							render={<NextLink href="/delivery"/>}
						>
							Доставка
						</Menu.LinkItem>

						<Menu.LinkItem
							closeOnClick
							render={<NextLink href="/credit"/>}
						>
							Рассрочка и кредит
						</Menu.LinkItem>

						<Menu.LinkItem
							closeOnClick
							render={<NextLink href="/warranty"/>}
						>
							Гарантия
						</Menu.LinkItem>

						<Menu.LinkItem
							closeOnClick
							render={<NextLink href="/contacts"/>}
						>
							Контакты
						</Menu.LinkItem>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	)
}