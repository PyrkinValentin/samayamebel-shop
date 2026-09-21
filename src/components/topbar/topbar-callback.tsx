"use client"

import { useState } from "react"

import { formatPhoneNumber } from "@/utils"

import { COMPANY_NAME } from "@/constants"

import NextLink from "next/link"
import { Dialog, Link, Separator } from "@cora-ui/react"
import { ChevronDown } from "lucide-react"

import { TopbarCallbackCreate } from "./topbar-callback-create"

type TopbarCallbackProps = {
	phoneNumber: string | undefined
}

export const TopbarCallback = (props: TopbarCallbackProps) => {
	const { phoneNumber } = props

	const [completed, setCompleted] = useState(false)

	const formattedPhoneNumber = formatPhoneNumber(phoneNumber, "INTERNATIONAL")

	const hasPhoneNumber = !!phoneNumber
	const hasFormattedPhoneNumber = !!formattedPhoneNumber

	const handleCompleted = () => {
		setCompleted(true)
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger
				itemScope
				itemType="https://schema.org/Organization"
				className="flex items-center gap-2 text-xs"
			>
				{hasFormattedPhoneNumber && (
					<meta
						itemProp="telephone"
						content={formattedPhoneNumber}
					/>
				)}

				<meta
					itemProp="name"
					content={COMPANY_NAME}
				/>

				{formattedPhoneNumber ?? "Заказать звонок"}
				<ChevronDown className="size-3.5 text-muted"/>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Backdrop/>

				<Dialog.Popup>
					<Dialog.Close nativeClose/>

					{!completed ? (
						<>
							<Dialog.Title>Заказать звонок</Dialog.Title>
							<TopbarCallbackCreate onCompleted={handleCompleted}/>

							<span className="mt-4 text-xs text-muted text-center text-pretty">
								Нажимая &laquo;Отправить&raquo;, вы соглашаетесь с <Link render={<NextLink href="/privacy"/>}
																																				 className="text-info after:h-0">
								Политикой конфиденциальности</Link> и даете согласие на обработку персональных данных
							</span>

							{hasPhoneNumber && hasFormattedPhoneNumber && (
								<>
									<Separator className="my-6"/>

									<div className="w-70 flex flex-col items-center gap-4 text-center">
										<span className="text-sm text-pretty">
											Сэкономьте ваше время — наберите наш номер прямо сейчас:
										</span>

										<Link
											href={`tel:${phoneNumber}`}
											className="text-lg font-medium"
										>
											{formattedPhoneNumber}
										</Link>
									</div>
								</>
							)}
						</>
					) : (
						<>
							<Dialog.Indicator status="success"/>
							<Dialog.Title>Ваша заявка принята</Dialog.Title>

							<Dialog.Description>
								Менеджер уже проверяет информацию и перезвонит вам в ближайшее время
							</Dialog.Description>
						</>
					)}
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}