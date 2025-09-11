import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Prefetch нотаток для першої сторінки без пошукового запиту
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, ''],
    queryFn: () => fetchNotes(1, ''),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={1} initialQuery="" />
    </HydrationBoundary>
  );
}
