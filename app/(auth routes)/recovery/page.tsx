"use client"
//import { useRouter } from "next/navigation"
import { ApiError } from "@/app/api/api"

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik"
import { useId, useState } from "react"
import css from "./SendMailForm.module.css"
import * as Yup from "yup"
import { passwordSendMail } from "@/lib/api/clientApi"
import toastMessage, { MyToastType } from "@/lib/messageService"

const SendMail = () => {
	const fieldId = useId()
	//const router = useRouter()
	const [error, setError] = useState("")
	const [isSending, setIsSending] = useState(false)

	interface SendMailFormValues {
		email: string
	}

	const initialValues: SendMailFormValues = {
		email: "",
	}

	const SendMailSchema = Yup.object().shape({
		email: Yup.string().email("Invalid email format").required("required"),
	})

	const handleSubmit = async (values: SendMailFormValues, formikHelpers: FormikHelpers<SendMailFormValues>) => {
		console.log("submit")

		setIsSending(true)
		formikHelpers.resetForm()

		try {
			const res = await passwordSendMail(values)

			if (!res.data.message || res?.status !== 200) {
				toastMessage(MyToastType.error, `E-mail not send. Server under maintanance`)
				setError("Server under maintanance")
			} else if (res) {
				toastMessage(MyToastType.success, res.data.message)
				//router.push("/sign-in")
				formikHelpers.resetForm()
			} else {
				setError("Oops... some error")
			}
		} catch (error) {
			toastMessage(MyToastType.error, `E-mail not send. Error found.${(error as ApiError).message}`)
			setError((error as ApiError).response?.data?.error ?? (error as ApiError).message ?? "Oops... some error")
		} finally {
			setIsSending(false)
		}
	}
	return (
		<div className={css.mainContent}>
			<h1 className={css.formTitle}>Enter e-mail you registered</h1>
			<Formik initialValues={initialValues} validationSchema={SendMailSchema} onSubmit={handleSubmit}>
				<Form className={css.form}>
					<div className={css.formGroup}>
						<label htmlFor="email">Your e-mail</label>
						<Field
							id={`${fieldId}-email`}
							type="text"
							name="email"
							placeholder="Enter email. Required"
							className={css.input}
						/>
						<ErrorMessage name="email" component="span" className={css.error} />
					</div>

					<div className={css.actions}>
						<button type="submit" className={css.submitButton} disabled={isSending}>
							{isSending ? `Sending e-mail...` : "Send"}
						</button>
					</div>
				</Form>
			</Formik>
			{error && <p className={css.error}>{error}</p>}
		</div>
	)
}

export default SendMail
