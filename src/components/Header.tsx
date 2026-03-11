import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ title, onMenuClick, userName, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>☰</button>
        <h1 className={styles.logo}>{title}</h1>
      </div>
      <div className={styles.right}>
        {userName && <span className={styles.userName}>👤 {userName}</span>}
        {onLogout && (
          <button className={styles.logoutBtn} onClick={onLogout}>
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}