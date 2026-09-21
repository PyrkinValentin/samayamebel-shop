import { AUTH_REDIRECT_PARAM, SEND_AUTH_INITIAL_DELAY } from "@/constants"

export const calculateWaitSeconds = (totalAttempts: number) => {
	return totalAttempts <= 3
		? SEND_AUTH_INITIAL_DELAY
		: Math.min(SEND_AUTH_INITIAL_DELAY * Math.pow(2, totalAttempts - 3), 3600)
}

export const getAuthRedirectUrl = () => {
	const searchParams = new URLSearchParams(location.search)
	const redirectUrl = searchParams.get(AUTH_REDIRECT_PARAM)

	if (redirectUrl) {
		return redirectUrl
	}
}