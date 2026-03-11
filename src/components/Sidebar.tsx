import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project { id: string; name: string; color: string; }

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sectionTitle}>Projets</h2>
      <ul className={styles.projectList}>
        {projects.map(p => (
          <li key={p.id} className={styles.projectItem}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.colorDot} style={{ background: p.color }} />
              {p.name}
            </NavLink>
            <div className={styles.actions}>
              {onRename && (
                <button className={styles.actionBtn} onClick={() => onRename(p)} title="Renommer">✏️</button>
              )}
              {onDelete && (
                <button className={styles.actionBtn} onClick={() => onDelete(p.id)} title="Supprimer">🗑️</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}