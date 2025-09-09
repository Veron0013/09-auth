import Link from "next/link"
import css from "./ProfilePage.module.css"
import Image from "next/image"
import { getServerMe } from "@/lib/api/serverApi"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
	const userData = await getServerMe()
	return {
		title: `Profile : ${userData.username}`,
		description: `${userData.username} Notehub user profile`,
		openGraph: {
			title: `Profile : ${userData.username}`,
			description: `${userData.username} Notehub user profile`,
			url: `https://notehub-app-auth.vercel.app/profile`,
			siteName: "NoteHub",
			images: [
				{
					url: "https://blues.com/wp-content/uploads/2023/02/notehub-js.webp",
					width: 1200,
					height: 630,
					alt: `Profile : ${userData.username}`,
				},
			],
			type: "article",
		},
	}
}

const Profile = async () => {
	const user = await getServerMe()
	return (
		<>
			<main className={css.mainContent}>
				<div className={css.profileCard}>
					<div className={css.header}>
						<h1 className={css.formTitle}>Profile Page</h1>
						<Link href="/profile/edit" className={css.editProfileButton}>
							Edit Profile
						</Link>
					</div>
					<div className={css.avatarWrapper}>
						<Image src={user.avatar || ""} alt="User Avatar" width={120} height={120} className={css.avatar} />
					</div>
					<div className={css.profileInfo}>
						<p>Name: {user.username}</p>
						<p>Email: {user.email}</p>
					</div>
				</div>
			</main>
		</>
	)
}

export default Profile
