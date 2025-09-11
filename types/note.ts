// Допустимі значення тегів
export type NoteTag = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';

// Модель однієї нотатки
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string; // тепер обов’язкове
}
