type WithRelation<P, C, Name extends string> = P & { [K in Name]: C[] }

export function mergeRelations<
	Parent extends { id: string | number },
	Child extends Record<string, unknown>,
	Key extends keyof Child,
	RelationName extends string
>(
	parents: Parent[],
	children: Child[],
	childKey: Key,
	relationName: RelationName
): WithRelation<Parent, Child, RelationName>[]

export function mergeRelations<
	Parent extends { id: string | number },
	Child extends Record<string, unknown>,
	Key extends keyof Child,
	RelationName extends string
>(
	parents: Parent,
	children: Child[],
	childKey: Key,
	relationName: RelationName
): WithRelation<Parent, Child, RelationName>

export function mergeRelations<
	Parent extends { id: string | number },
	Child extends Record<string, unknown>,
	Key extends keyof Child,
	RelationName extends string
>(
	parents: Parent[] | Parent,
	children: Child[],
	childKey: Key,
	relationName: RelationName
) {
	const grouped = Map.groupBy(children, (child) => child[childKey] as PropertyKey) as Map<PropertyKey, Child[]>

	if (Array.isArray(parents)) {
		return parents.map((parent) => ({
			...parent,
			[relationName]: grouped.get(parent.id) ?? [],
		}))
	}

	return {
		...parents,
		[relationName]: grouped.get(parents.id) ?? [],
	}
}