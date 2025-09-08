import Link from "next/link"
import React from "react"
import css from "@/components/Header/Header.module.css"
import TagsMenu from "../TagsMenu/TagsMenu"
import AuthNavigation from "../AuthNavigation/AuthNavigation"

export default async function Header() {
	return (
		<header className={css.header}>
			<Link href="/" aria-label="Home">
				NoteHub
			</Link>
			<nav aria-label="Main Navigation">
				<ul className={css.navigation}>
					<li>
						<Link href="/">Home</Link>
					</li>
					<AuthNavigation />
					<li>
						<TagsMenu />
					</li>
				</ul>
			</nav>
		</header>
	)
}
