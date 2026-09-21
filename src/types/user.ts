export type UserRole = "user" | "manager"

export type User = {
	id: string
	role: UserRole
	phoneNumber: string
	phoneNumberVerified: boolean | null
	email: string
	emailVerified: boolean | null
	name: string
	lastname: string
	bonus: number
	createdAt: Date
	updatedAt: Date
}

export type UserRoleConfig = Record<UserRole, {
	title: string
}>