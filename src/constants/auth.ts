export const AUTH_OTP_LENGTH = 4
export const AUTH_OTP_INPUTS = Array.from({ length: AUTH_OTP_LENGTH }, (_, k) => k)

export const SEND_AUTH_INITIAL_DELAY = 30
export const AUTH_MAX_ATTEMPTS = 3

export const AUTH_REDIRECT_PARAM = "redirectAfterAuth"