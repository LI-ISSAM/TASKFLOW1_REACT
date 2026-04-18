import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { memo } from 'react';
import useProjects from '../hooks/useProjects';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

interface Project { id: string; name: string; color: string; }

const MemoizedSidebar = memo(Sidebar);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } =
    useProjects();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const handleRename = useCallback((project: Project) => {
    renameProject(project);
  }, [renameProject]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={user?.name}
        onLogout={() => dispatch(logout())}
      />
      <div className={styles.body}>
        <MemoizedSidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={handleRename}
        />
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name, color) => {
                  addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}