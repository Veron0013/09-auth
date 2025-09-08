"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchNoteById } from "@/lib/api"
import css from "./page.module.css"
import Loading from "@/app/loading"
import Error from "@/app/error"

const NoteDetailsClient = () => {
	const { id } = useParams<{ id: string }>()

	const {
		data: note,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["notesQuery", id],
		queryFn: () => fetchNoteById(id),
		refetchOnMount: false,
	})

	if (isLoading) return <Loading />

	if (error || !note) return <Error error={error ? error : undefined} />

	const dateFormat: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}

	const isValidDate = (value: string): boolean => {
		const d = new Date(value)
		return !isNaN(d.getTime())
	}

	const formatDateSafe = (value: string): string => {
		return isValidDate(value) ? new Date(value).toLocaleDateString("en-US", dateFormat) : value
	}

	const createdAt = formatDateSafe(note.createdAt)
	const updatedAt = formatDateSafe(note.updatedAt)

	const formattedDate = note.updatedAt ? `Updated at: ${updatedAt}` : `Created at: ${createdAt}`

	return (
		<div className={css.container}>
			<div className={css.item}>
				<div className={css.header}>
					<h2>{note.title}</h2>
				</div>
				<p className={css.description}>{note.content}</p>
				<p className={css.date}>{formattedDate}</p>
				<p className={css.tag}>{note.tag}</p>
			</div>
		</div>
	)
}

export default NoteDetailsClient
