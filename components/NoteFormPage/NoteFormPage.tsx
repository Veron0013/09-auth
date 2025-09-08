"use client"

//import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik"
import { useId, useState } from "react"
import css from "./NoteFormPage.module.css"
//import * as Yup from "yup"
import { useMutation } from "@tanstack/react-query"
import type { NotePost, Tag } from "@/types/note"
import { createNote } from "@/lib/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { useRouter } from "next/navigation"
import { useTaskStore } from "@/lib/store/noteStore"

//interface NoteFormProps {
//	noteObject: Note | null
//	onClose: () => void
//}

export default function NoteFormPage() {
	const fieldId = useId()
	const router = useRouter()
	const { draft, setDraft, resetDraft } = useTaskStore()

	const [status, setStatus] = useState<{ toastText: string; buttonText: string }>({
		toastText: "created",
		buttonText: "Create",
	})

	//interface NotesFormValues {
	//	title: string
	//	content: string
	//	tag: Tag
	//}

	//const initialValues: NotesFormValues = {
	//	title: "",
	//	content: "",
	//	tag: "" as NotesFormValues["tag"],
	//}

	//const NotesSchema = Yup.object().shape({
	//	title: Yup.string().min(3, "too small").max(50, "too large").required("required"),
	//	content: Yup.string().max(500, "too large"),
	//	tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required("required"),
	//})

	const saveNote = async (noteData: NotePost) => {
		return await createNote(noteData) // POST
	}

	const { mutate, isPending } = useMutation({ mutationFn: saveNote })

	//const handleSubmit = async (values: NotesFormValues, formikHelpers: FormikHelpers<NotesFormValues>) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		setStatus({
			toastText: "created",
			buttonText: "Create",
		})
		//if (!noteObject) {
		//	formikHelpers.resetForm()
		//}
		const noteData: NotePost = { ...draft }

		mutate(noteData, {
			onSuccess: () => {
				//if (!noteObject) formikHelpers.resetForm() // тільки для створення
				toastMessage(MyToastType.success, `Note successfully ${status.toastText}`)
				//queryClient.invalidateQueries({ queryKey: ["notesQuery"] })
				router.back()
				resetDraft()
			},
			onError: (error: Error) => {
				toastMessage(MyToastType.error, `Note not ${status.toastText}. Error found.${error.message}`)
			},
		})
	}
	return (
		<div>
			{/*<Formik initialValues={initialValues} validationSchema={NotesSchema} onSubmit={handleSubmit}>*/}
			<form className={css.form} onSubmit={handleSubmit}>
				<div className={css.formGroup}>
					<label htmlFor="title">Title</label>
					<input
						id={`${fieldId}-title`}
						type="text"
						name="title"
						placeholder="Enter title. Required"
						className={css.input}
						value={draft.title}
						onChange={(e) => setDraft({ ...draft, title: e.target.value })}
					/>
					{/*<ErrorMessage name="title" component="span" className={css.error} />*/}
				</div>

				<div className={css.formGroup}>
					<label htmlFor="content">Content</label>
					<textarea
						id={`${fieldId}-content`}
						name="content"
						rows={8}
						placeholder="Enter main text"
						className={css.textarea}
						value={draft.content}
						onChange={(e) => setDraft({ ...draft, content: e.target.value })}
					/>
					{/*<ErrorMessage name="content" component="span" className={css.error} />*/}
				</div>

				<div className={css.formGroup}>
					<label htmlFor="tag">Tag</label>
					<select
						id={`${fieldId}-tag`}
						name="tag"
						className={css.select}
						value={draft.tag}
						onChange={(e) => setDraft({ ...draft, tag: e.target.value as Tag })}
					>
						<option value="">-- Choose tag --</option>
						<option value="Todo">Todo</option>
						<option value="Work">Work</option>
						<option value="Personal">Personal</option>
						<option value="Meeting">Meeting</option>
						<option value="Shopping">Shopping</option>
					</select>
					{/*<ErrorMessage name="tag" component="span" className={css.error} />*/}
				</div>

				<div className={css.actions}>
					<button type="button" className={css.cancelButton} onClick={() => router.back()}>
						Cancel
					</button>
					<button type="submit" className={css.submitButton} disabled={isPending}>
						{isPending ? `${status.buttonText}ing note...` : status.buttonText}
					</button>
				</div>
			</form>
			{/*</Formik>*/}
		</div>
	)
}
