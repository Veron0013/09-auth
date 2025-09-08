import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik"
import { useId, useState } from "react"
import css from "./NoteForm.module.css"
import * as Yup from "yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Note, NotePost, Tag } from "@/types/note"
import { createNote, updateNote } from "@/lib/api"
import toastMessage, { MyToastType } from "@/lib/messageService"

interface NoteFormProps {
	noteObject: Note | null
	onClose: () => void
}

export default function NoteForm({ noteObject, onClose }: NoteFormProps) {
	const fieldId = useId()
	const queryClient = useQueryClient()
	const [status, setStatus] = useState<{ toastText: string; buttonText: string }>({
		toastText: !noteObject ? "created" : "updated",
		buttonText: !noteObject ? "Create" : "Update",
	})

	interface NotesFormValues {
		title: string
		content: string
		tag: Tag
	}

	const initialValues: NotesFormValues = {
		title: noteObject?.title || "",
		content: noteObject?.content || "",
		tag: (noteObject?.tag || "") as NotesFormValues["tag"],
	}

	const NotesSchema = Yup.object().shape({
		title: Yup.string().min(3, "too small").max(50, "too large").required("required"),
		content: Yup.string().max(500, "too large"),
		tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required("required"),
	})

	const saveNote = async (noteData: NotePost) => {
		if (noteObject) {
			return await updateNote(noteData, noteObject.id) // PATCH
		}
		return await createNote(noteData) // POST
	}

	const { mutate, isPending } = useMutation({ mutationFn: saveNote })

	//	,
	//	onSuccess() {
	//		onClose()
	//		toastMessage(MyToastType.success, `Note successfully ${status.toastText}`)
	//		queryClient.invalidateQueries({ queryKey: ["notesQuery"] })
	//	},
	//	onError(error: AxiosError) {
	//		toastMessage(MyToastType.error, `Note not ${status.toastText}. Error found.${error.message} `)
	//	},
	//})

	const handleSubmit = async (values: NotesFormValues, formikHelpers: FormikHelpers<NotesFormValues>) => {
		setStatus({
			toastText: !noteObject ? "created" : "updated",
			buttonText: !noteObject ? "Create" : "Update",
		})
		//if (!noteObject) {
		//	formikHelpers.resetForm()
		//}
		const noteData: NotePost = {
			...values,
		}

		mutate(noteData, {
			onSuccess: () => {
				if (!noteObject) formikHelpers.resetForm() // тільки для створення
				onClose()
				toastMessage(MyToastType.success, `Note successfully ${status.toastText}`)
				queryClient.invalidateQueries({ queryKey: ["notesQuery"] })
			},
			onError: (error: Error) => {
				toastMessage(MyToastType.error, `Note not ${status.toastText}. Error found.${error.message}`)
			},
		})
	}
	return (
		<div>
			<Formik initialValues={initialValues} validationSchema={NotesSchema} onSubmit={handleSubmit}>
				<Form className={css.form}>
					<div className={css.formGroup}>
						<label htmlFor="title">Title</label>
						<Field
							id={`${fieldId}-title`}
							type="text"
							name="title"
							placeholder="Enter title. Required"
							className={css.input}
						/>
						<ErrorMessage name="title" component="span" className={css.error} />
					</div>

					<div className={css.formGroup}>
						<label htmlFor="content">Content</label>
						<Field
							as="textarea"
							id={`${fieldId}-content`}
							name="content"
							rows={8}
							placeholder="Enter main text"
							className={css.textarea}
						/>
						<ErrorMessage name="content" component="span" className={css.error} />
					</div>

					<div className={css.formGroup}>
						<label htmlFor="tag">Tag</label>
						<Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
							<option value="">-- Choose tag --</option>
							<option value="Todo">Todo</option>
							<option value="Work">Work</option>
							<option value="Personal">Personal</option>
							<option value="Meeting">Meeting</option>
							<option value="Shopping">Shopping</option>
						</Field>
						<ErrorMessage name="tag" component="span" className={css.error} />
					</div>

					<div className={css.actions}>
						<button type="button" className={css.cancelButton} onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className={css.submitButton} disabled={isPending}>
							{isPending ? `${status.buttonText}ing note...` : status.buttonText}
						</button>
					</div>
				</Form>
			</Formik>
		</div>
	)
}
