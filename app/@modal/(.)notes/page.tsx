import { fetchNoteById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotePreviewClient from './[id]/NotePreview.client';

type Props = {
  params: { id: string };
};

const NotePreview = ({ params }: Props) => {
  const { id } = params;
  const queryClient = new QueryClient();

  // Prefetch синхронно перед рендером
  queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
};

export default NotePreview;
