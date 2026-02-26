import { useState, useEffect } from 'react'; 
import Header from './components/Header'; 
import Sidebar from './components/Sidebar'; 
import MainContent from './components/MainContent'; 
  
interface Project { id: string; name: string; color: string; } 
interface Column { id: string; title: string; tasks: string[]; } 
  
export default function App() { 
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [projects, setProjects] = useState<Project[]>([]); 
  const [columns, setColumns] = useState<Column[]>([]); 
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => { 
    async function fetchData() { 
      try { 
        const [projRes, colRes] = await Promise.all([ 
          fetch('http://localhost:4000/projects'), 
          fetch('http://localhost:4000/columns'), 
        ]); 
        setProjects(await projRes.json()); 
        setColumns(await colRes.json()); 
      } catch (error) { 
        console.error('Erreur:', error); 
      } finally { 
        setLoading(false); 
      } 

      console.log("UseEffect exécuté, données chargées");
      console.log("Projects:", projects);
      console.log("Columns:", columns);
    } 

    fetchData(); 
  }, []);  
  
  
  return ( 
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}> 
      <Header title="TaskFlow" onMenuClick={() => setSidebarOpen(p => !p)} /> 
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}> 
        <Sidebar projects={projects} isOpen={sidebarOpen} /> 
        <MainContent columns={columns} /> 
      </div> 
    </div> 
  ); 
}