"use client"

import { useTransition } from "react"

import { authClient } from "@/auth/client"
import { getAuthRedirectUrl } from "./utils"
import { toast } from "@/components/toast"

import { afterAuthAction } from "./actions"

import { Button, Spinner } from "@cora-ui/react"

type HeaderLoginAuthOtpPasskeyProps = {
	phoneNumber: string
}

export const HeaderLoginAuthOtpPasskey = (props: HeaderLoginAuthOtpPasskeyProps) => {
	const { phoneNumber } = props

	const [pending, startTransition] = useTransition()

	const handleCancel = async () => {
		await afterAuthAction(getAuthRedirectUrl())
	}

	const handleCreate = () => {
		startTransition(async () => {
			try {
				const { error } = await authClient.passkey.addPasskey({ name: phoneNumber })

				if (error) {
					toast.error("Процесс был отменен или не поддерживается устройством")

					return
				}

				try {
					await afterAuthAction(getAuthRedirectUrl())
				} catch {
				}

				toast.success("Доступ настроен", "В следующий раз вы сможете войти с помощью Touch/Face ID")
			} catch {
				toast.error()
			}
		})
	}

	return (
		<>
			<Button
				variant="secondary"
				className="w-full"
				onClick={handleCancel}
			>
				Позже
			</Button>

			<Button
				disabled={pending}
				className="w-full"
				onClick={handleCreate}
			>
				{pending
					? <Spinner/>
					: "Включить"
				}
			</Button>
		</>
	)
}