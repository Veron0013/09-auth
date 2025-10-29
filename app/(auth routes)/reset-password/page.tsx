"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { ApiError } from "@/app/api/api"

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik"
import { useId, useState } from "react"
import css from "./ResetPassword.module.css"
import * as Yup from "yup"
import { resetPassword } from "@/lib/api/clientApi"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { BiHide, BiShow } from "react-icons/bi"

const ResetPassword = () => {
	interface ResetPasswordFormValues {
		password: string
	}

	const initialValues: ResetPasswordFormValues = {
		password: "",
	}

	const SendMailSchema = Yup.object().shape({
		password: Yup.string().min(8).max(36).required("required"),
	})

	const fieldId = useId()
	const router = useRouter()
	const [error, setError] = useState("")
	const [show, setShow] = useState(false)
	const [isSending, setIsSending] = useState(false)

	const searchParams = useSearchParams()
	const token = searchParams.get("token")

	//console.log(token)

	const handleSubmit = async (
		values: ResetPasswordFormValues,
		formikHelpers: FormikHelpers<ResetPasswordFormValues>
	) => {
		setIsSending(true)
		formikHelpers.resetForm()

		try {
			const res = await resetPassword({ ...values, token: String(token) })

			console.log(res, res?.status)

			if (!res.data.message || res?.status !== 200) {
				toastMessage(MyToastType.error, `Password not changed. Server under maintanance`)
				setError("Server under maintanance")
			} else if (res.data) {
				toastMessage(MyToastType.error, res.data.message)
				router.push("/sign-in")
				formikHelpers.resetForm()
			} else {
				setError("Oops... some error")
			}
		} catch (error) {
			toastMessage(MyToastType.error, `Password not changed. Error found.${(error as ApiError).message}`)
			setError((error as ApiError).response?.data?.error ?? (error as ApiError).message ?? "Oops... some error")
		} finally {
			setIsSending(false)
		}
	}
	return (
		<div className={css.mainContent}>
			<Formik initialValues={initialValues} validationSchema={SendMailSchema} onSubmit={handleSubmit}>
				<Form className={css.form}>
					<div className={css.formGroup}>
						<label htmlFor="password">Enter new password here</label>
						<div className={css.passwordWrapper}>
							<Field
								id={`${fieldId}-password`}
								type={!show ? "password" : "text"}
								name="password"
								placeholder="Enter password"
								autoComplete="off"
								className={css.input}
							/>
							<span className={css.toggleIcon} onClick={() => setShow(!show)}>
								{!show ? <BiHide /> : <BiShow />}
							</span>
						</div>
						<ErrorMessage name="password" component="span" className={css.error} />
					</div>

					<div className={css.actions}>
						<button type="submit" className={css.submitButton} disabled={isSending}>
							{isSending ? `Changing password...` : "Change password"}
						</button>
					</div>
				</Form>
			</Formik>
			{error && <p className={css.error}>{error}</p>}
		</div>
	)
}

export default ResetPassword
