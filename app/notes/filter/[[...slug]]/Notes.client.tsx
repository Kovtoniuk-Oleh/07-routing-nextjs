'use client';

import { useState, ChangeEvent } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import { NoteTags, type Tag, type Tags } from '@/types/note';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import { Toaster } from 'react-hot-toast';
import css from './Notes.module.css';

interface NotesClientProps {
  categories: Tags;
  category: Exclude<Tag, 'All'> | undefined;
}

export default function NotesClient({ categories, category }: NotesClientProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['notes', { search: debouncedQuery, page, category }],
    queryFn: () =>
      fetchNotes({
        search: debouncedQuery,
        page,
        tag: category ?? null,
      }),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  const onQueryChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setQuery(e.target.value);
  }, 300);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const trimmedQuery = query.trim();
  let emptyMessage = 'There are no notes yet. Create the first one!';

  if (trimmedQuery) {
    emptyMessage = category
      ? `No notes match your search in the "${category}" category.`
      : 'No results found for your query.';
  } else if (category) {
    emptyMessage = `There are no notes in the "${category}" category yet.`;
  }

  if (isLoading) {
    return (
      <p className={css.status} role="status">
        Loading notes, please wait...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className={css.status} role="status">
        Could not fetch notes. {error instanceof Error && error.message}
      </p>
    );
  }

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox onChange={onQueryChange} />
        {totalPages > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage} />}
        <button className={css.button} onClick={handleOpenModal} aria-label="Create new note">
          + Create note
        </button>
      </header>

      {isSuccess &&
        (notes.length > 0 ? <NoteList notes={notes} /> : <p className={css.empty}>{emptyMessage}</p>)}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm
            categories={[...categories]} // ✅ передаємо mutable копію
            onSubmit={handleCloseModal}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}
