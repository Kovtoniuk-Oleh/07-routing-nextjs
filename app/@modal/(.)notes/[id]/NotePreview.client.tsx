'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { useRouter } from 'next/navigation';
import css from './NotePreview.module.css';
import type { Note } from '@/types/note';

export interface NotePreviewClientProps {
  // обов’язково експортувати інтерфейс
  noteId: string;
}

const NotePreviewClient = ({ noteId }: NotePreviewClientProps) => {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <section className={css.wrapper}>
      <button className={css.backBtn} onClick={() => router.back()}>
        Back
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <p className={css.tag}>{note.tag}</p>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.updatedAt ?? note.createdAt}</p>
        </div>
      </div>
    </section>
  );
};

export default NotePreviewClient;
