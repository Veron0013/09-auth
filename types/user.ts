export type User = {
	email: string
	username: string
	avatar: string
}

export type EditUser = Omit<User, "avatar">
