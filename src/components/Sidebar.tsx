import styles from './Sidebar.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
}

export default function Sidebar({ projects, isOpen }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sectionTitle}>Projets</h2>
      <ul className={styles.projectList}>
        {projects.map(project => (
          <li key={project.id} className={styles.projectItem}>
            <span className={styles.colorDot} style={{ background: project.color }} />
            {project.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}