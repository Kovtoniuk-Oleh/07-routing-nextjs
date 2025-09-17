'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id, // запит запускається лише якщо є id
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
};

export default NoteDetailsClient;
