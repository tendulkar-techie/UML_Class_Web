import { useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { DiagramProvider, useDiagram } from './hooks/useDiagram';
import Toolbar from './components/Toolbar/Toolbar';
import DiagramCanvas from './components/Canvas/DiagramCanvas';
import PropertiesPanel from './components/PropertiesPanel/PropertiesPanel';
import CodePanel from './components/CodePanel/CodePanel';
import { generateJavaCode } from './utils/codeGenerator';
import { exportDiagram, importDiagram, downloadJson } from './utils/diagramSerializer';
import './App.css';

function AppContent() {
  const { state, dispatch } = useDiagram();
  const fileInputRef = useRef(null);

  const handleAddClass = useCallback(
    (stereotype) => {
      dispatch({ type: 'ADD_CLASS', payload: { stereotype } });
    },
    [dispatch]
  );

  const handleGenerateCode = useCallback(() => {
    if (state.nodes.length === 0) return;
    const code = generateJavaCode(state.nodes, state.edges);
    dispatch({ type: 'SET_GENERATED_CODE', payload: code });
  }, [state.nodes, state.edges, dispatch]);

  const handleExport = useCallback(() => {
    const json = exportDiagram(state.nodes, state.edges);
    downloadJson(json, 'uml-diagram.json');
  }, [state.nodes, state.edges]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const result = importDiagram(ev.target.result);
          dispatch({ type: 'IMPORT', payload: result });
        } catch (err) {
          alert('Invalid diagram file: ' + err.message);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    if (state.nodes.length === 0 && state.edges.length === 0) return;
    if (window.confirm('Clear all classes and relationships? This cannot be undone.')) {
      dispatch({ type: 'CLEAR' });
    }
  }, [state.nodes.length, state.edges.length, dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'SET_RELATIONSHIP_MODE', payload: null });
        dispatch({ type: 'SET_SELECTED_NODE', payload: null });
        dispatch({ type: 'SET_SELECTED_EDGE', payload: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="app-layout">
      <Toolbar
        onAddClass={handleAddClass}
        relationshipMode={state.relationshipMode}
        setRelationshipMode={(mode) =>
          dispatch({ type: 'SET_RELATIONSHIP_MODE', payload: mode })
        }
        onGenerateCode={handleGenerateCode}
        onExport={handleExport}
        onImport={handleImport}
        onClear={handleClear}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="app-body">
        <div className="canvas-area">
          <DiagramCanvas />
        </div>
        <PropertiesPanel />
      </div>
      <CodePanel />
      {state.relationshipMode && (
        <div className="relationship-mode-indicator">
          <span>🔗 Drawing: {state.relationshipMode}</span>
          <button onClick={() => dispatch({ type: 'SET_RELATIONSHIP_MODE', payload: null })}>
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <DiagramProvider>
        <AppContent />
      </DiagramProvider>
    </ReactFlowProvider>
  );
}
