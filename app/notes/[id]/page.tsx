import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';

interface NoteDetailsProps {
  params: Promise<{ id: string }>; // 👈 params тепер async
}

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const { id } = await params; // 👈 обов'язковий await
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
};

export default NoteDetails;
