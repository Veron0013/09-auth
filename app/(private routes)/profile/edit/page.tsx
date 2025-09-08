import Link from "next/link"
import css from "./EditProfilePage.module.css"
function EditProfile() {
	return (
		<div>
			<main className={css.mainContent}>
				<div className={css.profileCard}>
					<h1 className={css.formTitle}>Edit Profile</h1>

					<img src="avatar" alt="User Avatar" width={120} height={120} className={css.avatar} />

					<form className={css.profileInfo}>
						<div className={css.usernameWrapper}>
							<label htmlFor="username">Username:</label>
							<input id="username" type="text" className={css.input} />
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
