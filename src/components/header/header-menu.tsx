import { Button, Drawer } from "@cora-ui/react"
import { TextAlignJustify } from "lucide-react"

export const HeaderMenu = () => {
	return (
		<Drawer.Root swipeDirection="left">
			<Drawer.Trigger
				aria-label="Меню"
				className="flex sm:hidden"
				render={
					<Button
						iconOnly
						variant="ghost"
					/>
				}
			>
				<TextAlignJustify className="size-5"/>
			</Drawer.Trigger>

			<Drawer.Portal keepMounted>
				<Drawer.Backdrop/>

				<Drawer.Viewport position="left">
					<Drawer.Popup>
						<Drawer.Close nativeClose/>

						<Drawer.Content>
							sdfsdfsf
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	)
}