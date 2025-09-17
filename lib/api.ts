import axios from 'axios';
import type { Note, Tag } from '../types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api/';
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

type SortBy = 'created' | 'updated';

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: Tag | null; // null або 'All' означає без фільтра
  sortBy?: SortBy;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

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

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`notes/${id}`);
  return data;
};

export const createNote = async (title: string, content: string, tag: Tag): Promise<Note> => {
  const { data } = await axios.post<Note>('notes', { title, content, tag });
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`notes/${id}`);
  return data;
};
