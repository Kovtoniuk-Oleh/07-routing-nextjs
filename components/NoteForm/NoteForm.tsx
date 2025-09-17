'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { NoteTags, type Tag } from '@/types/note';
import { createNote } from '@/lib/api';
import toast from 'react-hot-toast';
import css from './NoteForm.module.css';

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialTag?: Tag;
  categories?: Tag[];
  onSubmit: () => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: Tag;
}

export default function NoteForm({
  initialTitle = '',
  initialContent = '',
  initialTag = 'Todo',
  categories = NoteTags.filter((tag) => tag !== 'All'),
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be less or equal to 50 characters')
      .required('Title is required'),
    content: Yup.string().max(500, 'Content must be less or equal to 500 characters'),
    tag: Yup.string().oneOf(categories).required('Tag is required'),
  });

  const mutation = useMutation({
    mutationFn: async ({ title, content, tag }: FormValues) => {
      return await createNote(title, content, tag);
    },
    onSuccess: () => {
      toast.success('Note created!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSubmit();
    },
    onError: () => {
      toast.error('Failed to create note.');
    },
  });

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{ title: initialTitle, content: initialContent, tag: initialTag }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field type="text" name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field as="textarea" name="content" id="content" rows={6} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" name="tag" id="tag" className={css.select}>
            {categories.map((tag) => (
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
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
