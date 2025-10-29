import { PER_PAGE, TAGS_ARRAY } from "@/lib/vars"
import type { Note, NoteId, NotePost, NotesData, SortBy, Tag } from "@/types/note"
import { User } from "@/types/user"
import { nextServer } from "./api"

//axios.defaults.baseURL = MAIN_URL
//axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
export type LoginRequest = {
	email: string
	password: string
}

export type ResetPasswordSendmailRequest = {
	email: string
}

export type RestorePasswordRequest = {
	token: string
	password: string
}

export type RegisterRequest = {
	email: string
	password: string
	userName: string
}

type CheckSessionRequest = {
	success: boolean
}

export interface SearchParams {
	search: string
	tag?: Tag
	page?: number
	perPage?: number
	sortBy?: SortBy
}

export interface ApiQueryParams {
	params: SearchParams
}

export type Category = {
	id: string
	name: string
	description: string
	createdAt: string
	updatedAt: string
}

export const getCategories = (): string[] => {
	return TAGS_ARRAY
}

export const createQueryParams = (search = "", page = 1, tag?: string): ApiQueryParams => {
	const params: SearchParams = {
		search,
		page,
		perPage: PER_PAGE,
	}
	//console.log(tag)
	if (tag !== "All") {
		params.tag = tag as Tag
	}

	return { params }
}

export const fetchNotes = async (queryParams: ApiQueryParams): Promise<NotesData> => {
	const refreshSession = await checkSession()
	if (refreshSession) {
		const response = await nextServer.get<NotesData>("/notes", queryParams)
		return response.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const deleteNote = async (id: NoteId): Promise<Note> => {
	const refreshSession = await checkSession()
	if (refreshSession) {
		const response = await nextServer.delete<Note>(`/notes/${id}`)
		return response.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const createNote = async (queryParams: NotePost): Promise<Note> => {
	const refreshSession = await checkSession()
	if (refreshSession) {
		const response = await nextServer.post<Note>("/notes", queryParams)
		return response.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const updateNote = async (queryParams: NotePost, id: NoteId): Promise<Note> => {
	const refreshSession = await checkSession()
	if (refreshSession) {
		const response = await nextServer.patch<Note>(`/notes/${id}`, queryParams)
		return response.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
	//const response = await axios.get<Note>(`${MAIN_URL}/${id}`)
	const refreshSession = await checkSession()

	if (refreshSession) {
		const response = await nextServer.get<Note>(`/notes/${id}`)
		return response.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

////////////////////////////////////////

export const login = async (data: LoginRequest) => {
	const res = await nextServer.post<User>("/auth/login", data)
	return res.data
}

export const logout = async (): Promise<void> => {
	await nextServer.post("/auth/logout")
}

export const register = async (data: RegisterRequest) => {
	const res = await nextServer.post<User>("/auth/register", data)
	return res.data
}

export const checkSession = async () => {
	const res = await nextServer.get<CheckSessionRequest>("/auth/session")
	return res.data.success
}

export const getMe = async () => {
	const refreshSession = await checkSession()
	if (refreshSession) {
		const { data } = await nextServer.get<User>("/users/me")
		return data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export type UpdateUserRequest = {
	username?: string
	avatar?: File | null
}

export const updateMe = async (payload: UpdateUserRequest) => {
	const refreshSession = await checkSession()

	if (refreshSession) {
		const formData = new FormData()

		if (payload.username) formData.append("username", payload.username)
		if (payload.avatar) formData.append("avatar", payload.avatar)

		const res = await nextServer.patch<User>("/users/me", formData)
		return res.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData()
	formData.append("file", file)
	const { data } = await nextServer.post("/upload", formData)
	return data.url
}

export const passwordSendMail = async (email: ResetPasswordSendmailRequest) => {
	const res = await nextServer.post("/auth/request-reset-email", email)
	return res.data
}

export const resetPassword = async (body: RestorePasswordRequest) => {
	const res = await nextServer.post("/auth/reset-password", body)
	return { data: res.data, status: res.status }
}
