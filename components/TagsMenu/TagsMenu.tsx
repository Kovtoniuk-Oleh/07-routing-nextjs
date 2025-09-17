'use client';

import { useState } from 'react';
import Link from 'next/link';
import css from './TagsMenu.module.css';
import { NoteTags, type Tag } from '@/types/note';

interface TagsMenuProps {
  categories?: readonly Tag[];
}

export default function TagsMenu({ categories = NoteTags }: TagsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu} aria-haspopup="true" aria-expanded={isOpen}>
        Notes {isOpen ? '▾' : '▴'}
      </button>

      {isOpen && (
        <ul className={css.menuList}>
          {categories.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag === 'All' ? '' : tag}`}
                className={css.menuLink}
                scroll={false}
                onClick={closeMenu}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
