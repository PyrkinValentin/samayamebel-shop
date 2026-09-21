import { Chip, Menu } from "@cora-ui/react"
import NextLink from "next/link"

import {
	ChevronRight,
	Globe,
	Headset,
	LayoutDashboard,
	LayoutGrid,
	Package,
	Palette,
	Ruler,
	Settings,
	ShoppingBag,
	SlidersHorizontal,
	Store,
	UsersRound,
} from "lucide-react"

type HeaderAccountMenuManagerProps = {
	countPendingOrders: number
	countPendingCallbacks: number
}

export const HeaderAccountMenuManager = (props: HeaderAccountMenuManagerProps) => {
	const {
		countPendingOrders,
		countPendingCallbacks,
	} = props

	const hasOrders = countPendingOrders > 0
	const hasCallbacks = countPendingCallbacks > 0

	return (
		<>
			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/manager"/>}
			>
				<LayoutDashboard/> Панель
			</Menu.LinkItem>

			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/manager/orders"/>}
			>
				<ShoppingBag/> Заказы
				{hasOrders && (
					<Chip className="ms-auto">
						{countPendingOrders}
					</Chip>
				)}
			</Menu.LinkItem>

			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/manager/support"/>}
			>
				<Headset/> Поддержка

				{hasCallbacks && (
					<Chip className="ms-auto">
						{countPendingCallbacks}
					</Chip>
				)}
			</Menu.LinkItem>

			<Menu.Separator/>

			<Menu.SubmenuRoot>
				<Menu.SubmenuTrigger>
					<Store/> Магазин
					<ChevronRight className="ms-auto"/>
				</Menu.SubmenuTrigger>

				<Menu.Portal>
					<Menu.Positioner side="left">
						<Menu.Popup>
							<Menu.LinkItem
								closeOnClick
								render={<NextLink href="/manager/catalog"/>}
							>
								<Package/>
								Каталог
							</Menu.LinkItem>

							<Menu.LinkItem
								closeOnClick
								render={<NextLink href="/manager/storefront"/>}
							>
								<LayoutGrid/>
								Витрина
							</Menu.LinkItem>

							<Menu.Separator/>

							<Menu.LinkItem
								closeOnClick
								render={<NextLink href="/manager/attributes"/>}
							>
								<SlidersHorizontal/> Свойства
							</Menu.LinkItem>

							<Menu.LinkItem
								closeOnClick
								render={<NextLink href="/manager/colors"/>}
							>
								<Palette/> Цвета
							</Menu.LinkItem>

							<Menu.LinkItem
								closeOnClick
								render={<NextLink href="/manager/units"/>}
							>
								<Ruler/> Ед. измерения
							</Menu.LinkItem>
						</Menu.Popup>
					</Menu.Positioner>
				</Menu.Portal>
			</Menu.SubmenuRoot>

			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/manager/customers"/>}
			>
				<UsersRound/>
				Покупатели
			</Menu.LinkItem>

			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/manager/content"/>}
			>
				<Globe/>
				Контент
			</Menu.LinkItem>

			<Menu.Separator/>

			<Menu.LinkItem
				closeOnClick
				render={<NextLink href="/manager/settings"/>}
			>
				<Settings/>
				Настройки
			</Menu.LinkItem>
		</>
	)
}