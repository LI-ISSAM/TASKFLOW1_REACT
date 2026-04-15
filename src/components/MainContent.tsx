import styles from './MainContent.module.css';

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

interface MainContentProps {
  columns: Column[];
}

export default function MainContent({ columns }: MainContentProps) {
  return (
    <main className={styles.main}>
      <div className={styles.board}>
        {columns.map(col => (
          <div key={col.id} className={styles.column}>
            <h3 className={styles.columnTitle}>{col.title}</h3>
            <div className={styles.taskList}>
              {col.tasks.map((task, i) => (
                <div key={i} className={styles.task}>{task}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}