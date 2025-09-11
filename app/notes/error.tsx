'use client';

import css from './Error.module.css';

interface ErrorProps {
  error: Error;
}

const ErrorMessage = ({ error }: ErrorProps) => {
  return (
    <div className={css.container}>
      <p className={css.text}>⚠️ Could not fetch the list of notes.</p>
      <p className={css.details}>{error.message}</p>
    </div>
  );
};

export default ErrorMessage;
