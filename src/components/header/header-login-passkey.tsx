"use client"

import { useTransition } from "react"

import { authClient } from "@/auth/client"
import { toast } from "@/components/toast"
import { getAuthRedirectUrl } from "./utils"

import { afterAuthAction } from "./actions"

import { Button, Spinner } from "@cora-ui/react"
import { Fingerprint } from "lucide-react"

export const HeaderAccountLoginPasskey = () => {
	const [pending, startTransition] = useTransition()

	const handlePasskey = () => {
		startTransition(async () => {
			try {
				const { error } = await authClient.signIn.passkey()

				if (error) {
					return
				}

				try {
					await afterAuthAction(getAuthRedirectUrl())
				} catch {
				}
			} catch {
				toast.error()
			}
		})
	}

	return (
		<Button
			disabled={pending}
			variant="outline"
			className="w-full"
			onClick={handlePasskey}
		>
			{pending
				? <Spinner/>
				: <Fingerprint/>
			}

			Touch/Face ID
		</Button>
	)
}