'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

const NotePreviewClient = ({ id }: NotePreviewClientProps) => {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.status} role="status">
          <p>Loading note details...</p>
        </div>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.status} role="alert">
          <p>Could not fetch note.</p>
          <p className={css.message}>{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.wrapper} aria-labelledby="note-title">
        <button className={css.backBtn} onClick={handleClose} aria-label="Go back">
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
              {note.updatedAt && note.updatedAt !== note.createdAt
                ? `Updated: ${note.updatedAt}`
                : `Created: ${note.createdAt}`}
            </p>
          </article>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
