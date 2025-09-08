import Link from "next/link"
import React from "react"
import css from "@/components/Header/Header.module.css"
import TagsMenu from "../TagsMenu/TagsMenu"

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
					{/*<li>
						<Link href="/notes">Notes</Link>
					</li>*/}
					<li>
						<TagsMenu />
					</li>
				</ul>
			</nav>
		</header>
	)
}
