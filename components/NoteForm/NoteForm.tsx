'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { createNote } from '@/lib/api';
import { Loading } from 'notiflix';
import toast from 'react-hot-toast';
import css from './NoteForm.module.css';

interface NoteFormProps {
  query: string;
  page: number;
  onSubmit: () => void; // закриття модалки після submit
  onCancel: () => void; // закриття модалки при cancel
}

const formTags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

export interface InitialValues {
  title: string;
  content: string;
  tag: (typeof formTags)[number];
}

const initialValues: InitialValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less or equal to 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be less or equal to 500 characters'),
  tag: Yup.mixed().oneOf(formTags).required(),
});

export default function NoteForm({ query, page, onSubmit, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: async (values: InitialValues) => {
      const data = await createNote(values);
      return data;
    },
    onSuccess: () => {
      Loading.remove();
      toast.success('Note has been successfully created!');
      queryClient.invalidateQueries({ queryKey: ['notes', query, page] });
      onSubmit(); // закриваємо модалку
    },
    onError: () => {
      Loading.remove();
      toast.error('Error occurred while creating note!');
    },
  });

  const handleSubmit = (values: InitialValues, actions: FormikHelpers<InitialValues>) => {
    Loading.hourglass();
    createNoteMutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field type="text" name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field as="textarea" name="content" id="content" rows={8} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" name="tag" id="tag" className={css.select}>
            {formTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
