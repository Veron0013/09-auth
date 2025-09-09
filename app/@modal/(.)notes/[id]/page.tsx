import { fetchNoteByIdServer } from "@/lib/api/serverApi"
import NotePreviewClient from "./NotePreview.client"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

type Props = {
	params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
	const { id } = await params

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["note", id],
		queryFn: () => fetchNoteByIdServer(id),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotePreviewClient />
		</HydrationBoundary>
	)
}

export default Page
