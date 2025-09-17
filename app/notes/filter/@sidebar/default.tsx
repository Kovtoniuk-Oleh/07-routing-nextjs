import Link from 'next/link';
import css from './SidebarNotes.module.css';
import { NoteTags } from '@/types/note';

const SidebarNotes = () => {
  return (
    <ul className={css.menuList}>
      {NoteTags.map((tag) => {
        const href = tag === 'All' ? '/notes/filter' : `/notes/filter/${tag}`;
        return (
          <li key={tag} className={css.menuItem}>
            <Link href={href} scroll={false} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNotes;
