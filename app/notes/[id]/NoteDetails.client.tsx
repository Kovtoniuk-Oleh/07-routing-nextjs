'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById, type Note } from '@/lib/api';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  noteId: string; // 👈 приймаємо id як пропс
}

export default function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <div className={css.loading}>
        <p>Loading note details...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={css.error}>
        <p>Something went wrong. Please try again later.</p>
        <button className={css.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <section className={css.wrapper} aria-labelledby="note-title">
      <button className={css.backBtn} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css.container}>
        <article className={css.item}>
          <header className={css.header}>
            <h2 id="note-title">{note.title}</h2>
            <p className={css.tag}>{note.tag}</p>
          </header>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {note.updatedAt ? `Updated: ${note.updatedAt}` : `Created: ${note.createdAt}`}
          </p>
        </article>
      </div>
    </section>
  );
}
