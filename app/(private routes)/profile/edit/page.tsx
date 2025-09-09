"use client"

import Link from "next/link"
import Image from "next/image"
import css from "./EditProfilePage.module.css"
//import AvatarPicker from "@/components/AvatarPicker/AvatarPicker"
import { useEffect, useState } from "react"
import { getMe, updateMe } from "@/lib/api/clientApi"
import { useRouter } from "next/navigation"
import { User } from "@/types/user"
import { useAuthStore } from "@/lib/store/authStore"

const EditProfile = () => {
	const router = useRouter()
	const [user, setEditUser] = useState<User | null>(null)
	const [userName, setUserName] = useState("")
	const setUser = useAuthStore((state) => state.setUser)
	//const [imageFile, setImageFile] = useState<File | null>(null)

	useEffect(() => {
		getMe().then((user) => {
			setEditUser(user ?? null)
		})
	}, [])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(event.target.value)
	}

	const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		//await updateMe({ username: userName, avatar })
		await updateMe({ username: userName })
		if (user) {
			setUser(user)
		}
		router.push("/profile")
	}
	return (
		<>
			<main className={css.mainContent}>
				<div className={css.profileCard}>
					<h1 className={css.formTitle}>Edit Profile</h1>
					{/*<AvatarPicker profilePhotoUrl={avatar} onChangePhoto={setImageFile} />
					{imageFile && <p>{imageFile.name}</p>}*/}
					<Image src={user?.avatar || ""} alt="User Avatar" width={120} height={120} className={css.avatar} />
					<p>Sorry, uploading images under maintanance</p>

					<form className={css.profileInfo} onSubmit={handleSaveUser}>
						<div className={css.usernameWrapper}>
							<label htmlFor="username">Username:</label>
							<input id="username" type="text" className={css.input} value={userName} onChange={handleChange} />
						</div>

						<p>{`Email: ${user?.email || ""}`}</p>

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
		</>
	)
}

export default EditProfile
