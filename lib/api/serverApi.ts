import { cookies } from "next/headers"
import { nextServer } from "./api"
import { User } from "@/types/user"
import { Note, NoteId } from "@/types/note"

export const checkServerSession = async () => {
	// Дістаємо поточні cookie
	const cookieStore = await cookies()
	const res = await nextServer.get("/auth/session", {
		headers: {
			// передаємо кукі далі
			Cookie: cookieStore.toString(),
		},
	})
	return res
}

export const getServerMe = async (): Promise<User> => {
	const cookieStore = await cookies()
	const { data } = await nextServer.get("/users/me", {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})
	return data
}

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
	const cookieStore = await cookies()
	const response = await nextServer.get<Note>(`/notes/${id}`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})
	return response.data
}
