import axios from 'axios';
import { Note, NoteTag } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

const API_BASE = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!token) throw new Error('NEXT_PUBLIC_NOTEHUB_TOKEN is not set');

const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` },
});

/** Отримати список нотаток з пагінацією, пошуком, тегом та сортуванням */
export const fetchNotes = async (
  page: number = 1,
  search: string = '',
  perPage: number = 12,
  tag?: NoteTag,
  sortBy?: string
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search, tag, sortBy },
  });
  return data;
};

/** Створити нову нотатку */
export const createNote = async (note: { title: string; content: string; tag: NoteTag }): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

/** Видалити нотатку за id */
export const deleteNote = async (id: string): Promise<{ id: string }> => {
  const { data } = await api.delete<{ id: string }>(`/notes/${id}`);
  return data;
};

/** Отримати нотатку за id */
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
