"use client"

import type { Errors } from "@/types"

import { useState, useTransition } from "react"
import { useCountdown } from "@/hooks"

import { validateSchema } from "@/zod"
import { toast } from "@/components/toast"
import { authClient } from "@/auth/client"
import { getAuthRedirectUrl } from "./utils"

import { otpSchema } from "./schemas"
import { OTPAction, afterAuthAction } from "./actions"

import { AUTH_OTP_INPUTS, AUTH_OTP_LENGTH } from "@/constants"

import { AlertDialog, Field, Form, OTPField, Spinner } from "@cora-ui/react"
import { Fingerprint } from "lucide-react"

import { HeaderAccountLoginAuthOtpPasskey } from "./header-account-login-auth-otp-passkey"

type AccountLoginAuthOtpProps = {
	phoneNumber: string
	nextAvailableDate: Date
}

export const HeaderAccountLoginAuthOtp = (props: AccountLoginAuthOtpProps) => {
	const {
		phoneNumber,
		nextAvailableDate,
	} = props

	const [timeActive, timeToWait] = useCountdown(nextAvailableDate)
	const [pending, startTransition] = useTransition()
	const [errors, setErrors] = useState<Errors>({})
	const [passkeyOpen, setPasskeyOpen] = useState(false)

	const handleValueComplete = (code: string) => {
		const { errors, values } = validateSchema(otpSchema, { phoneNumber, code })

		if (errors) {
			setErrors(errors)

			return
		}

		startTransition(async () => {
			try {
				const { error } = await OTPAction(values)

				if (error) {
					if (error.errors) setErrors(error.errors)
					if (error.message) toast.error(error.message)

					return
				}

				const { data: passkeys } = await authClient.passkey.listUserPasskeys()

				if (
					passkeys &&
					passkeys.length === 0
				) {
					setPasskeyOpen(true)

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
		<>
			<Form
				errors={errors}
				className="mt-6 flex flex-col gap-2"
			>
				<Field.Root
					name="code"
					className="items-center"
				>
					<OTPField.Root
						className="relative"
						length={AUTH_OTP_LENGTH}
						onValueComplete={handleValueComplete}
					>
						{AUTH_OTP_INPUTS.map((input) => (
							<OTPField.Input
								key={input}
								autoFocus={input === 0}
							/>
						))}

						{pending && (
							<Spinner
								size="lg"
								className="absolute -right-4 translate-x-full"
							/>
						)}
					</OTPField.Root>

					<Field.Error/>
				</Field.Root>

				<span className="mt-2 text-center text-xs text-pretty text-muted">
					{timeActive
						? `Проверьте папку «Спам». Если кода нет, вы сможете запросить его снова ${timeToWait}`
						: "Вы можете закрыть это окно и запросить код повторно, нажав кнопку «Продолжить»"
					}
				</span>
			</Form>

			<AlertDialog.Root
				open={passkeyOpen}
				onOpenChange={setPasskeyOpen}
			>
				<AlertDialog.Portal>
					<AlertDialog.Backdrop/>

					<AlertDialog.Viewport>
						<AlertDialog.Popup>
							<AlertDialog.Indicator>
								<Fingerprint/>
							</AlertDialog.Indicator>

							<AlertDialog.Title>Включить быстрый вход?</AlertDialog.Title>

							<AlertDialog.Description>
								Это позволит входить в систему по Touch/Face ID за одно касание. Безопасно и быстро
							</AlertDialog.Description>

							<AlertDialog.Actions>
								<HeaderAccountLoginAuthOtpPasskey phoneNumber={phoneNumber}/>
							</AlertDialog.Actions>
						</AlertDialog.Popup>
					</AlertDialog.Viewport>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</>
	)
}