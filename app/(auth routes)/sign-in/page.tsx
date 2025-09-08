"use client"

// Додаємо імпорти
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, LoginRequest } from "@/lib/api/api"
import { ApiError } from "@/app/api/api"
import css from "./SignInPage.module.css"

const SignIn = () => {
	const router = useRouter()
	const [error, setError] = useState("")

	const handleSubmit = async (formData: FormData) => {
		try {
			// Типізуємо дані форми
			const formValues = Object.fromEntries(formData) as LoginRequest
			// Виконуємо запит
			const res = await login(formValues)
			// Виконуємо редірект або відображаємо помилку
			if (res) {
				router.push("/profile")
			} else {
				setError("Invalid email or password")
			}
		} catch (error) {
			setError((error as ApiError).response?.data?.error ?? (error as ApiError).message ?? "Oops... some error")
		}
	}
	return (
		<>
			<main className={css.mainContent}>
				<h1 className={css.formTitle}>Sign in</h1>
				<form className={css.form} action={handleSubmit}>
					<div className={css.formGroup}>
						<label htmlFor="email">Email</label>
						<input id="email" type="email" name="email" className={css.input} required />
					</div>

					<div className={css.formGroup}>
						<label htmlFor="password">Password</label>
						<input id="password" type="password" name="password" className={css.input} required />
					</div>

					<div className={css.actions}>
						<button type="submit" className={css.submitButton}>
							Log in
						</button>
						{error && <p>{error}</p>}
					</div>
				</form>
			</main>
		</>
	)
}

export default SignIn
