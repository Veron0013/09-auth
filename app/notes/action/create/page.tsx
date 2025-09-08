import NoteFormPage from "@/components/NoteFormPage/NoteFormPage"
import css from "./page.module.css"
import { Metadata } from "next"

//type Props = {
//	params: Promise<{ id: string }>
//}
export const dynamic = "force-dynamic"
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Note: create new note`,
		description: "New note creation data",
		openGraph: {
			title: `Note: create new note`,
			description: "New note creation data",
			url: `https://08-zustand-eight-rouge.vercel.app/notes/action/create`,
			siteName: "NoteHub",
			images: [
				{
					url: "https://blues.com/wp-content/uploads/2023/02/notehub-js.webp",
					width: 1200,
					height: 630,
					alt: "Note: create new note",
				},
			],
			type: "article",
		},
	}
}

export default function Page() {
	return (
		<main className={css.main}>
			<div className={css.container}>
				<h1 className={css.title}>Create note</h1>
				<NoteFormPage />
			</div>
		</main>
	)
}
