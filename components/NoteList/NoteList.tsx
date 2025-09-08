import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ConfirmDimentions, Note, NoteId } from "../../types/note"
import css from "./NoteList.module.css"
import { deleteNote } from "@/lib/api"
import { useState } from "react"
import toastMessage, { MyToastType } from "@/lib/messageService"
import ConfirmMessage from "../ConfirnMessage/ConfirnMessage"
import Link from "next/link"

interface NoteListProps {
	onSelect: (noteObjectSelected: Note) => void
	notes: Note[]
	tag: string
}

export default function NoteList({ notes, onSelect, tag }: NoteListProps) {
	const queryClient = useQueryClient()
	const [showConfirm, setShowConfirm] = useState(false)
	const [noteSelectedId, setNoteSelectedId] = useState<NoteId | null>(null)
	const [confirmPosition, setConfirmPosition] = useState<ConfirmDimentions | null>(null)

	const { mutate: deleteMutation } = useMutation<Note, Error, string>({
		mutationFn: deleteNote,
		onSuccess(note) {
			toastMessage(MyToastType.success, `Note ${note.title} deleted`)
			queryClient.invalidateQueries({ queryKey: ["notesQuery"] })
		},
		onError(error: Error) {
			toastMessage(MyToastType.error, `Note not deleted. Error found.${error.message} `)
		},
	})

	const handleClick = (e: React.MouseEvent<HTMLLIElement>, item: Note) => {
		const noteSelected: NoteId = e.currentTarget.id as NoteId

		if (!noteSelected) return

		setNoteSelectedId(noteSelected)

		const target = e.target as HTMLElement

		if (target.closest("#deleteButton")) {
			const rect = e.currentTarget.getBoundingClientRect()
			setConfirmPosition({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
			setShowConfirm(true)
		}
		if (target.closest("#editButton")) {
			const noteObjectSelected = { ...item }
			return onSelect(noteObjectSelected)
		}
	}

	return (
		<div>
			<ul className={css.list}>
				{notes.map((item: Note, index: number) => {
					return (
						<li
							key={item.id}
							id={item.id.toString()}
							onClick={(e) => handleClick(e, item)}
							className={css.listItem}
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<h2 className={css.title}>{item.title}</h2>
							<p className={css.content}>{item.content}</p>
							<div className={css.footer}>
								<span className={css.tag}>{item.tag}</span>
								<div className={css.buttonsWrapper}>
									<button className={`${css.button} ${css.delete}`} id="deleteButton">
										Delete
									</button>
									<button className={`${css.button} ${css.edit}`} id="editButton">
										Edit
									</button>
									{/*href={{`/notes/${item.id}`, query: { from: slug.join("/") }>*/}

									<Link
										className={`${css.button} ${css.details}`}
										href={{
											pathname: `/notes/${item.id}`,
											query: { from: tag },
										}}
									>
										View details
									</Link>
								</div>
							</div>
						</li>
					)
				})}
			</ul>
			{showConfirm && (
				<ConfirmMessage
					confirmPosition={confirmPosition!}
					onConfirm={() => {
						if (noteSelectedId) {
							deleteMutation(noteSelectedId!)
							setShowConfirm(false)
						}
					}}
					onCancel={() => setShowConfirm(false)}
				/>
			)}
		</div>
	)
}
