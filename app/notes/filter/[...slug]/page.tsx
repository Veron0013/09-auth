import { createQueryParams, fetchNotes } from "@/lib/api"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import NotesClient from "./Notes.client"
import { Metadata } from "next"

type Props = {
	params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const noteFilter: string = slug[0] || "All notes"
	return {
		title: `Notes: ${noteFilter}`,
		description: `Notes filtered by ${noteFilter}`,
		openGraph: {
			title: `Notes: ${noteFilter}`,
			description: `Notes filter: ${noteFilter}`,
			url: `https://08-zustand-eight-rouge.vercel.app/notes/filter/${noteFilter}`,
			siteName: "NoteHub",
			images: [
				{
					url: "https://blues.com/wp-content/uploads/2023/02/notehub-js.webp",
					width: 1200,
					height: 630,
					alt: noteFilter,
				},
			],
			type: "article",
		},
	}
}

const NotesByCategory = async ({ params }: Props) => {
	const { slug } = await params
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["notesQuery", slug[0] || "All"],
		queryFn: () => fetchNotes(createQueryParams("", 1, slug[0] || "All")),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotesClient tag={slug[0]} />
		</HydrationBoundary>
	)
}

export default NotesByCategory
