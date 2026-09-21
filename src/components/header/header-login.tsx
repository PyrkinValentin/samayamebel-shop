"use client"

import { useLoginDialogState } from "./hooks"

import NextLink from "next/link"
import { Button, Dialog, Link, Separator } from "@cora-ui/react"
import { UserRound } from "lucide-react"

import { HeaderAccountLoginAuth } from "./header-account-login-auth"
import { HeaderAccountLoginPasskey } from "./header-account-login-passkey"

export const HeaderAccountLogin = () => {
	const [open, setOpen] = useLoginDialogState()

	return (
		<Dialog.Root
			open={open}
			onOpenChange={setOpen}
		>
			<Dialog.Trigger
				render={
					<Button
						iconOnly
						aria-label="Личный кабинет"
						variant="ghost"
					/>
				}
			>
				<UserRound className="size-5"/>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Backdrop/>

				<Dialog.Popup>
					<Dialog.Close nativeClose/>
					<Dialog.Title>Вход или регистрация</Dialog.Title>

					<Dialog.Description>
						Войдите, чтобы сохранять избранное на любом устройстве и копить бонусы за покупки
					</Dialog.Description>

					<HeaderAccountLoginAuth/>

					<span className="mt-4 text-xs text-muted text-center text-pretty">
						Нажимая &laquo;Получить код&raquo;, вы соглашаетесь с <Link render={<NextLink href="/privacy"/>}
																																				className="text-info after:h-0">
						Политикой конфиденциальности</Link> и даете согласие на обработку персональных данных
					</span>

					<span className="my-6 w-full flex items-center gap-4 text-xs">
						<Separator className="shrink"/> или <Separator className="shrink"/>
					</span>

					<HeaderAccountLoginPasskey/>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}