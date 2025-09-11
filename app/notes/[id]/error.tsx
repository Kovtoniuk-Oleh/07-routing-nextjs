'use client';

import css from './NoteError.module.css';

interface NoteErrorProps {
  error: Error;
}

const NoteError = ({ error }: NoteErrorProps) => {
  return (
    <div className={css.container}>
      <p className={css.title}>⚠️ Could not fetch note details</p>
      <p className={css.message}>{error.message}</p>
    </div>
  );
};

export default NoteError;
