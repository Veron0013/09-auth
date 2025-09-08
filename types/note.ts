export interface NotesData {
	notes: Note[]
	totalPages: number
}

export interface Note {
	id: string
	title: string
	content: string
	createdAt: string
	updatedAt: string
	userId: string
	tag: Tag
}

export type NoteId = Note["id"]

export type NotePost = Partial<Note>

export type Tag =
	| "Work"
	| "Personal"
	| "Meeting"
	| "Shopping"
	| "Ideas"
	| "Travel"
	| "Finance"
	| "Health"
	| "Important"
	| "Todo"

export type SortBy = "title" | "dateCreated" | "tag"

export type ConfirmDimentions = {
	top: number
	left: number
	width: number
	height: number
}
