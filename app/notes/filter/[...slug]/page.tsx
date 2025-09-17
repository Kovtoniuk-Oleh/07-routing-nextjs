// app/notes/filter/[...slug]/page.tsx
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { NoteTags, type Tag } from '@/types/note';
import NotesClient from './Notes.client';

export const dynamicParams = false;
export const revalidate = 900;

export const generateStaticParams = async () => {
  return NoteTags.map((tag) => ({ slug: [tag] }));
};

interface NotesPageProps {
  params: { slug?: string[] };
}

export default async function NotesPage({ params }: NotesPageProps) {
  // ✅ params — звичайний об’єкт, НЕ Promise
  const slug = params.slug ?? [];
  const first = slug[0];

  const category: Exclude<Tag, 'All'> | undefined =
    first === 'All' || !first ? undefined : (first as Exclude<Tag, 'All'>);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, category }],
    queryFn: () =>
      fetchNotes({
        search: '',
        page: 1,
        tag: category ?? null,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient categories={NoteTags} category={category} />
    </HydrationBoundary>
  );
}
