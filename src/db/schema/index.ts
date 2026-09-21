import { attribute, attributeRelations } from "./attribute"
import { attributeOption, attributeOptionsRelations } from "./attribute-option"
import { account, accountRelations, passkey, passkeyRelations, session, sessionRelations, verification } from "./auth"
import { callback, callbackRelations } from "./callback"
import { category, categoryRelations } from "./category"
import { location, locationRelations } from "./location"
import { unit } from "./unit"
import { user, userRelations } from "./user"

export const schema = {
	attribute, attributeRelations,
	attributeOption, attributeOptionsRelations,
	account, accountRelations, passkey, passkeyRelations, session, sessionRelations, verification,
	callback, callbackRelations,
	category, categoryRelations,
	location, locationRelations,
	unit,
	user, userRelations,
}