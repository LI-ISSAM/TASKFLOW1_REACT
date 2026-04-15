import { useState, useEffect } from 'react';
import { useAuth } from './features/auth/AuthContext';
import Login from './features/auth/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Tooltip from './components/Tooltip';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function App() {
  const { state: authState } = useAuth();

  if (!authState.user) {
    return <Login />;
  }

  return <Dashboard />;
}

function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTooltipDemo, setShowTooltipDemo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [p, co] = await Promise.all([
          fetch('http://localhost:4000/projects'),
          fetch('http://localhost:4000/columns'),
        ]);
        setProjects(await p.json());
        setColumns(await co.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>⏳ Chargement...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.5rem 1.5rem', background: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
            <button
              onClick={() => setShowTooltipDemo(p => !p)}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', cursor: 'pointer', borderRadius: 4 }}
            >
              {showTooltipDemo ? '🙈 Masquer' : '🔬 Afficher'} démo Bonus useLayoutEffect
            </button>
          </div>
          {showTooltipDemo && (
            <div style={{ padding: '1rem 1.5rem' }}>
              <Tooltip />
            </div>
          )}
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}