import styles from './Sidebar.module.css';

interface Project {
    id : string;
    name :String;
    color : string;
}
interface SidebarProps{
    projects : Project [];
    isOpen : boolean;
}

export default function Sidebar({projects,isOpen} : SidebarProps){
    return (
        <aside className = {`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <h2>
                Mes projets
            </h2>
            <ul>
                {
                    projects.map(project => (
                        <li key={project.id} className={styles.projectItem}>
                            <span className={styles.projectColor} style={{backgroundColor : project.color}}></span>
                            {project.name}
                        </li>
                    ))
                }
            </ul>
           
        </aside>
    )
}