'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { useRouter } from 'next/navigation';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  noteId: string;
}

const NoteDetailsClient = ({ noteId }: NoteDetailsClientProps) => {
  const router = useRouter();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
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

export default NoteDetailsClient;
