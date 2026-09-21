import type { HeaderData } from "./queries"

import NextLink from "next/link"
import { Link } from "@cora-ui/react"

import { HeaderFloating } from "./header-floating"
import { HeaderMenu } from "./header-menu"
import { HeaderCatalog } from "./header-catalog"
import { HeaderSearch } from "./header-search"
import { HeaderFavorites } from "./header-favorites"
import { HeaderCart } from "./header-cart"

import { HeaderProfileMenu } from "@/components/header/header-profile-menu";
import { HeaderLogin } from "@/components/header/header-login";

export const Header = (props: HeaderData) => {
	const {
		user,
		favoriteCount,
		cartCount,
	} = props

	return (
		<HeaderFloating>
			<div className="absolute sm:static left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0">
				<Link
					render={<NextLink href="/"/>}
					className="font-bold text-lg after:h-0"
				>
					LOGO BRAND
				</Link>
			</div>

			<div className="sm:ms-14">
				<HeaderMenu/>
				<HeaderCatalog/>
			</div>

			<div className="sm:ms-4">
				<HeaderSearch/>
			</div>

			<div className="ms-auto flex items-center">
				{user
					? <HeaderProfileMenu user={user}/>
					: <HeaderLogin/>
				}

				<HeaderFavorites count={favoriteCount}/>
				<HeaderCart count={cartCount}/>
			</div>
		</HeaderFloating>
	)
}