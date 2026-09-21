import type { AuthInstance } from "../auth"

import { createAuthClient } from "better-auth/react"
import { anonymousClient, customSessionClient, phoneNumberClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

export const authClient = createAuthClient({
	plugins: [
		anonymousClient(),
		phoneNumberClient(),
		passkeyClient(),
		customSessionClient<AuthInstance>(),
	],
})