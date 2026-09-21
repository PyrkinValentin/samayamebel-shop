import type { AttributeTable } from "@/db/schema/attribute"
import type { AttributeOptionTable } from "@/db/schema/attribute-option"

export type AttributeType = AttributeTable["type"]
export type Attribute = AttributeTable
export type AttributeOption = AttributeOptionTable
