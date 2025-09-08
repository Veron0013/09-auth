import axios from "axios"
import { MAIN_URL, PER_PAGE, TAGS_ARRAY } from "@/lib/vars"
import type { Note, NoteId, NotePost, NotesData, SortBy, Tag } from "@/types/note"
import { User } from "@/types/user"

const nextServer = axios.create({
	baseURL: "http://localhost:3000/api",
	withCredentials: true, // дозволяє axios працювати з cookie
})

//axios.defaults.baseURL = MAIN_URL
//axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
export type LoginRequest = {
	email: string
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

interface ApiQueryParams {
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
	//const url: string = id === null ? MAIN_URL : `${MAIN_URL}/${id}`
	//const response = await axios.get<NotesData>(MAIN_URL, queryParams)
	const response = await nextServer.get<NotesData>("/notes", queryParams)
	return response.data
}

export const deleteNote = async (id: NoteId): Promise<Note> => {
	const response = await nextServer.delete<Note>(`/notes/${id}`)
	return response.data
}

export const createNote = async (queryParams: NotePost): Promise<Note> => {
	//console.log("creation", queryParams)
	const response = await nextServer.post<Note>("/notes", queryParams)
	return response.data
}

export const updateNote = async (queryParams: NotePost, id: NoteId): Promise<Note> => {
	const response = await nextServer.patch<Note>(`/notes/${id}`, queryParams)
	return response.data
}

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
	//const response = await axios.get<Note>(`${MAIN_URL}/${id}`)
	const response = await nextServer.get<Note>(`/notes/${id}`)
	return response.data
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
	const { data } = await nextServer.get<User>("/users/me")
	return data
}
