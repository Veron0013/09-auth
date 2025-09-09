"use client"

import Link from "next/link"
import css from "./EditProfilePage.module.css"
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker"
import { useEffect, useState } from "react"
import { getMe, updateMe } from "@/lib/api/clientApi"
import { useRouter } from "next/navigation"

const EditProfile = () => {
	const router = useRouter()
	const [userName, setUserName] = useState("")
	const [avatar, setPhotoUrl] = useState("")
	const [imageFile, setImageFile] = useState<File | null>(null)

	useEffect(() => {
		getMe().then((user) => {
			setUserName(user.username ?? "")
			setPhotoUrl(user.avatar ?? "")
		})
	}, [])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(event.target.value)
	}

	const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		//await updateMe({ username: userName, avatar })
		await updateMe({ username: userName })
		router.push("/profile")
	}
	return (
		<div>
			<main className={css.mainContent}>
				<div className={css.profileCard}>
					<h1 className={css.formTitle}>Edit Profile</h1>
					<AvatarPicker profilePhotoUrl={avatar} onChangePhoto={setImageFile} />
					{imageFile && <p>{imageFile.name}</p>}
					<p>Sorry, uploading images under maintanance</p>
					{/*<Image src="avatar" alt="User Avatar" width={120} height={120} className={css.avatar} />*/}

					<form className={css.profileInfo} onSubmit={handleSaveUser}>
						<div className={css.usernameWrapper}>
							<label htmlFor="username">Username:</label>
							<input id="username" type="text" className={css.input} value={userName} onChange={handleChange} />
						</div>

						<p>Email: user_email@example.com</p>

						<div className={css.actions}>
							<button type="submit" className={css.saveButton}>
								Save
							</button>
							<Link href="/profile" className={css.cancelButton}>
								Cancel
							</Link>
						</div>
					</form>
				</div>
			</main>
		</div>
	)
}

export default EditProfile
