import type { UserItem } from "./types"

import { Button, Menu, ScrollArea } from "@cora-ui/react"
import { UserRound } from "lucide-react"

import { HeaderProfileMenuUser } from "./header-profile-menu-user"
import { HeaderProfileMenuManager } from "./header-profile-menu-manager"
import { HeaderProfileMenuLogout } from "./header-profile-menu-logout"

type HeaderProfileMenuProps = {
	user: UserItem
}

export const HeaderProfileMenu = (props: HeaderProfileMenuProps) => {
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

									{user.role === "user" && <HeaderProfileMenuUser/>}
									{user.role === "manager" && <HeaderProfileMenuManager/>}

									<HeaderProfileMenuLogout/>
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