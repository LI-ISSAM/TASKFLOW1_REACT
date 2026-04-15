import { useState, useLayoutEffect, useEffect, useRef } from 'react';

export default function Tooltip() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [useLayout, setUseLayout] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (useLayout) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [useLayout]);

  useLayoutEffect(() => {
    if (!useLayout) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [useLayout]);

  return (
    <div style={{ padding: '1rem', background: '#fffbe6', borderRadius: 8, marginBottom: '1rem', border: '1px solid #ffe58f' }}>
      <strong>🔬 Démo useLayoutEffect</strong>
      <br /><br />
      <button
        onClick={() => {
          setPosition({ top: 0, left: 0 });
          setUseLayout(prev => !prev);
        }}
        style={{ padding: '0.4rem 0.8rem', borderRadius: 6, cursor: 'pointer' }}
      >
        Mode actuel : <strong>{useLayout ? 'useLayoutEffect ✅' : 'useEffect ⚡'}</strong>
      </button>
      <br /><br />
      <button ref={buttonRef} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>
        📍 Référence bouton
      </button>
      <div style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: position.top === 0 ? 'red' : '#333',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        zIndex: 1000,
      }}>
        {position.top === 0 ? '⚡ FLASH (0,0)' : '✅ Info-bulle positionnée !'}
      </div>
    </div>
  );
}