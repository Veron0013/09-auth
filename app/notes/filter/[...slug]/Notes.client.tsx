"use client"

import { useEffect, useState } from "react"
import css from "./Notes.module.css"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { Note, NotesData } from "@/types/note"
import { createQueryParams, fetchNotes } from "@/lib/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { useDebouncedCallback } from "use-debounce"
import SearchBox from "@/components/SearchBox/SearchBox"
import Pagination from "@/components/Pagination/Pagination"
import NoteList from "@/components/NoteList/NoteList"
import Modal from "@/components/Modal/Modal"
import NoteForm from "@/components/NoteForm/NoteForm"
import { useRouter } from "next/navigation"

type Props = {
	tag: string
}

const NotesClient = ({ tag }: Props) => {
	const [notehubQuery, setNoteHubQuery] = useState("")
	//const [filterValue, setFilterValue] = useState("")
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [total_pages, setTotalPages] = useState<number>(0)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [noteObject, setNoteObject] = useState<Note | null>(null)
	const router = useRouter()

	const fetchQueryData = async () => {
		const res: NotesData = await fetchNotes(createQueryParams(notehubQuery, currentPage, tag))
		//console.log(res)
		if (!res.notes.length) {
			toastMessage(MyToastType.error, "No matches on this request. Please try another one")
		}
		setTotalPages(res.totalPages)
		return res
	}

	const { data } = useQuery({
		queryKey: ["notesQuery", notehubQuery, currentPage, tag],
		queryFn: async () => fetchQueryData(),
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	})

	useEffect(() => {
		if (data?.notes?.length) {
			setTotalPages(data.totalPages)
		}
	}, [data])

	const debouncedQueryChange = useDebouncedCallback((value: string) => {
		setNoteHubQuery(value)
		setCurrentPage(1)
	}, 300)

	const handleNoteClick = (noteObjectOut: Note) => {
		setNoteObject(noteObjectOut)
		openModal()
	}

	const closeModal = () => setIsModalOpen(false)
	const openModal = () => setIsModalOpen(true)

	return (
		<div className={css.app}>
			<header className={css.toolbar}>
				<SearchBox onQueryChange={debouncedQueryChange} />
				{total_pages > 1 && (
					<Pagination
						currentPage={currentPage}
						total_pages={total_pages}
						setCurrentPage={(newPage: number) => {
							setCurrentPage(newPage)
						}}
					/>
				)}
				<button className={css.button} onClick={() => router.push("/notes/action/create/")}>
					Create note +
				</button>
			</header>
			{data && data?.notes?.length > 0 && <NoteList notes={data.notes} onSelect={handleNoteClick} tag={tag} />}
			{isModalOpen && (
				<Modal onClose={closeModal}>
					<NoteForm onClose={closeModal} noteObject={noteObject} />
				</Modal>
			)}
		</div>
	)
}

export default NotesClient
