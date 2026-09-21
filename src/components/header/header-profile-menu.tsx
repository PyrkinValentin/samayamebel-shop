import type { UserItem } from "./types"

import { Button, Menu, ScrollArea } from "@cora-ui/react"
import { UserRound } from "lucide-react"

import { HeaderAccountMenuUser } from "./header-account-menu-user"
import { HeaderAccountMenuManager } from "./header-account-menu-manager"
import { HeaderAccountMenuLogout } from "./header-account-menu-logout"

type HeaderAccountProps = {
	user: UserItem
}

export const HeaderAccountMenu = (props: HeaderAccountProps) => {
	const { user } = props

	return (
		<Menu.Root>
			<Menu.Trigger
				aria-label="Личный кабинет"
				render={
					<Button
						iconOnly
						variant="ghost"
					/>
				}
			>
				<UserRound className="size-5"/>
			</Menu.Trigger>

			<Menu.Portal>
				<Menu.Positioner>
					<Menu.Popup className="min-w-50">
						<Menu.Arrow/>

						<ScrollArea.Root>
							<ScrollArea.Viewport scrollFade>
								<ScrollArea.Content>
									<span className="mx-3 my-2 block text-sm font-medium">
										Личный кабинет
									</span>

									{user.role === "user" && <HeaderAccountMenuUser/>}

									{user.role === "manager" && (
										<HeaderAccountMenuManager
											countPendingOrders={countPendingOrders}
											countPendingCallbacks={countPendingCallbacks}
										/>
									)}

									<HeaderAccountMenuLogout/>
								</ScrollArea.Content>
							</ScrollArea.Viewport>

							<ScrollArea.ScrollBar>
								<ScrollArea.Thumb/>
							</ScrollArea.ScrollBar>
						</ScrollArea.Root>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	)
}