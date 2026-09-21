import type { Auth } from "../auth"

import { createAuthClient } from "better-auth/react"
import { customSessionClient, phoneNumberClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

export const authClient = createAuthClient({
	plugins: [
		phoneNumberClient(),
		passkeyClient(),
		customSessionClient<Auth>(),
	],
})