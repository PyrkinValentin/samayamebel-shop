import { account, accountRelations } from "./account"

import { category, categoryRelations } from "./category"
import { passkey, passkeyRelations } from "./passkey"
import { session, sessionRelations } from "./session"
import { user, userRelations } from "./user"
import { verification } from "./verification"

export const schema = {
	account,
	accountRelations,
	category, categoryRelations,
	passkey, passkeyRelations,
	session, sessionRelations,
	user, userRelations,
	verification,
}