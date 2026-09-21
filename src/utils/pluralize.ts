type PluralKey =
	| "bonus"
	| "category"
	| "product"
	| "symbol"

type PluralForm = Partial<Record<Intl.LDMLPluralRule, string>>

const ruPluralRules = new Intl.PluralRules("ru-RU")

const pluralForms: Record<PluralKey, PluralForm> = {
	bonus: { one: "бонус", few: "бонуса", many: "бонусов" },
	category: { one: "категория", few: "категории", many: "категорий" },
	product: { one: "товар", few: "товара", many: "товаров" },
	symbol: { one: "символ", few: "символа", many: "символов" },
}

export const pluralize = (count: number, key: PluralKey) => {
	const pluralForm = pluralForms[key]
	const pluralRule = ruPluralRules.select(count)

	return pluralForm[pluralRule] ?? pluralForm.many
}