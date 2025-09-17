// types/note.ts

// ✅ Масив доступних тегів
export const NoteTags = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

// ✅ Тип одного тега — літеральний union тип
export type Tag = (typeof NoteTags)[number];

// ✅ Тип для масиву тегів (не обов’язково, але можна використати)
export type Tags = readonly Tag[];

// ✅ Перевірка валідності тега
export const isValidTag = (tag: string): tag is Tag => {
  return NoteTags.includes(tag as Tag);
};

// ✅ Основний інтерфейс нотатки
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag;
}
