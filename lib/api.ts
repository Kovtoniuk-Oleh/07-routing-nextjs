// lib/api.ts
import axios from 'axios';
import type { Note as NoteType, Tag } from '../types/note'; // NoteType замість Note

axios.defaults.baseURL = 'https://notehub-public.goit.study/api/';
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

type SortBy = 'created' | 'updated';

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: Tag | null;
  sortBy?: SortBy;
}

export interface FetchNotesResponse {
  notes: NoteType[];
  totalPages: number;
}

// Тепер явно експортуємо Note
export type Note = NoteType;

export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { search = '', page = 1, perPage = 12, tag, sortBy } = params;

  const query = {
    search,
    page,
    perPage,
    ...(tag && tag !== 'All' ? { tag } : {}),
    ...(sortBy ? { sortBy } : {}),
  };

  const { data } = await axios.get<FetchNotesResponse>('notes', { params: query });
  return data;
};

export const fetchNoteById = async (id: string): Promise<NoteType> => {
  const { data } = await axios.get<NoteType>(`notes/${id}`);
  return data;
};

export const createNote = async (title: string, content: string, tag: Tag): Promise<NoteType> => {
  const { data } = await axios.post<NoteType>('notes', { title, content, tag });
  return data;
};

export const deleteNote = async (id: string): Promise<NoteType> => {
  const { data } = await axios.delete<NoteType>(`notes/${id}`);
  return data;
};
