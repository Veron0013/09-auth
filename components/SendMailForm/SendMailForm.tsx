import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik"
import { useId, useState } from "react"
import css from "./SendMailForm.module.css"
import * as Yup from "yup"
import { useMutation } from "@tanstack/react-query"
import { passwordSendMail, ResetPasswordSendmailRequest } from "@/lib/api/clientApi"
import toastMessage, { MyToastType } from "@/lib/messageService"

interface SendMailFormProps {
	noteObject: null
	onClose: () => void
}

export default function SendMailFormModal({ noteObject, onClose }: SendMailFormProps) {
	const fieldId = useId()
	const [status, setStatus] = useState<{ toastText: string; buttonText: string }>({
		toastText: "send",
		buttonText: "Send",
	})

	interface NotesFormValues {
		email: string
	}

	const initialValues: NotesFormValues = {
		email: "",
	}

	const NotesSchema = Yup.object().shape({
		title: Yup.string().email().required("required"),
	})

	const sendMail = async (sendMailData: ResetPasswordSendmailRequest) => {
		return await passwordSendMail(sendMailData)
	}

	const { mutate, isPending } = useMutation({ mutationFn: sendMail })

	const handleSubmit = async (values: NotesFormValues, formikHelpers: FormikHelpers<NotesFormValues>) => {
		setStatus({
			toastText: "E-mail send",
			buttonText: "E-mail send",
		})

		const sendMailData: ResetPasswordSendmailRequest = {
			...values,
		}

		mutate(sendMailData, {
			onSuccess: () => {
				if (!noteObject) formikHelpers.resetForm() // тільки для створення
				onClose()
				toastMessage(MyToastType.success, `E-mail ${status.toastText}`)
			},
			onError: (error: Error) => {
				toastMessage(MyToastType.error, `E-mail not ${status.toastText}. Error found.${error.message}`)
			},
		})
	}
	return (
		<div>
			<Formik initialValues={initialValues} validationSchema={NotesSchema} onSubmit={handleSubmit}>
				<Form className={css.form}>
					<div className={css.formGroup}>
						<label htmlFor="email">Your e-mail</label>
						<Field
							id={`${fieldId}-email`}
							type="email"
							name="email"
							placeholder="Enter email. Required"
							className={css.input}
						/>
						<ErrorMessage name="email" component="span" className={css.error} />
					</div>

					<div className={css.actions}>
						<button type="button" className={css.cancelButton} disabled={isPending} onClick={onClose}>
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
