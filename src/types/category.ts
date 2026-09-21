import type { CategoryDB, CreateCategoryDB } from "@/db/schema/category"

export type Category = CategoryDB
export type CreateCategory = CreateCategoryDB
export type UpdateCategory = Partial<Omit<CreateCategoryDB, "id">>