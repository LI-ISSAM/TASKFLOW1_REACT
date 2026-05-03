'use client';
import { useFormStatus } from 'react-dom';
import  { addProject } from '../actions/projects';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: '8px 16px',
        background: pending ? '#ccc' : '#1B8C3E',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: pending ? 'not-allowed' : 'pointer',
        fontWeight: 600,
      }}
    >
      {pending ? 'Création...' : '+ Nouveau projet'}
    </button>
  );
}

export default function AddProjectForm() {
  return (
    <form action={addProject} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      <input
        name="name"
        placeholder="Nom du projet"
        required
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: '0.95rem', minWidth: 180 }}
      />
      <input
        name="color"
        type="color"
        defaultValue="#3498db"
        style={{ width: 42, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer' }}
      />
      <SubmitButton />
    </form>
  );
}