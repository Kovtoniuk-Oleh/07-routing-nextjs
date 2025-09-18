import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';

interface NoteDetailsProps {
  params: { id: string }; // 👈 об’єкт, не Promise
}

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const { id } = params; // без await
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} /> {/* передаємо id */}
    </HydrationBoundary>
  );
};

export default NoteDetails;
