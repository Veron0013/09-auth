import React from "react"
import css from "@/components/Footer/Footer.module.css"

export default function Footer() {
	return (
		<footer className={css.footer}>
			<div className={css.content}>
				<p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
				<div className={css.wrap}>
					<p>Developer: Igor Vdovyka</p>
					<p>
						Contact us:
						<a href="mailto:iv_mirsoft@ukr.net"> iv_mirsoft@ukr.net</a>
					</p>
				</div>
			</div>
		</footer>
	)
}
