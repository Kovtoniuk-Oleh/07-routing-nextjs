'@tanstack/react-query';
import NotePreviewClient from './[id]/NotePreview.client';

import { fetchNoteById } from '@/lib/api';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: { id: string }; // обов’язково звичайний об’єкт
}

const NotePreview = async ({ params }: PageProps) => {
  const { id } = params;
  const queryClient = new QueryClient();

  // Prefetch даних на сервері
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient noteId={id} />
    </HydrationBoundary>
  );
};

export default NotePreview;
