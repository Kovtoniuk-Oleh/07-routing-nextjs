'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, FetchNotesResponse } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import { Toaster } from 'react-hot-toast';
import css from './notes.module.css';

interface NotesClientProps {
  initialPage?: number;
  initialQuery?: string;
}

const NotesClient = ({ initialPage = 1, initialQuery = '' }: NotesClientProps) => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(initialPage);
  const [query, setQuery] = useState<string>(initialQuery);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedQueryChange = useDebouncedCallback((value: string) => {
    setPage(1);
    setQuery(value);
  }, 300);

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, query],
    queryFn: () => fetchNotes(page, query),
    staleTime: 1000 * 60,
    placeholderData: () => queryClient.getQueryData<FetchNotesResponse>(['notes', page - 1, query]),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {error.message}</p>;

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        {/* Прибираємо value, залишаємо лише onChange */}
        <SearchBox onChange={(e) => debouncedQueryChange(e.target.value)} />

        {totalPages > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage} />}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList notes={notes} query={query} page={page} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            query={query}
            page={page}
            onSubmit={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
