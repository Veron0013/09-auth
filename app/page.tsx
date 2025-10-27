import css from "./page.module.css"

export default function Home() {
	return (
		<div className={css.page}>
			<main>
				<div className={css.container}>
					<h1 className={css.title}>Welcome to NoteHub</h1>

					<p className={css.description}>
						NoteHub is a simple and efficient application designed for managing personal notes. It helps keep your
						thoughts organized and accessible in one place, whether you are at home or on the go.
					</p>
					<p className={css.description}>
						The app provides a clean interface for writing, editing, and browsing notes. With support for keyword search
						and structured organization, NoteHub offers a streamlined experience for anyone who values clarity and
						productivity.
					</p>
					<p className={css.description}>Login : test@gmail.com</p>
					<p className={css.description}>Password : 12345678</p>
					<h2>Warning: Sometimes back-end is &apos;sleeping&apos;. Please waite for an hour</h2>
				</div>
			</main>
		</div>
	)
}
