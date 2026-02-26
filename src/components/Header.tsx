import styles from './Header.module.css';

interface HeaderProps {
    title : string;
    onMenuClick : () => void;
}

export default function Header({title,onMenuClick} : HeaderProps) {
    return (
        <header className={styles.header}>
            <div className ={styles.left}>
                <button className={styles.menuBtn} onClick = {onMenuClick}>
                    =
                </button>
                <h1 className={styles.logo}>
                    {title}
                </h1>
            </div>

            <span className={styles.avatar}>
                JD
            </span>
        </header>
    );
}