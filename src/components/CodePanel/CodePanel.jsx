import { useState, useEffect, useRef, useCallback } from 'react';
import { useDiagram } from '../../hooks/useDiagram';
import { generateJavaCode } from '../../utils/codeGenerator';
import { Copy, Check, Download, ChevronUp, ChevronDown, X } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import './CodePanel.css';

export default function CodePanel() {
  const { state, dispatch } = useDiagram();
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const isOpen = state.codePanelOpen;
  const codeMap = state.generatedCode;

  const classNames = codeMap ? Object.keys(codeMap) : [];

  useEffect(() => {
    if (classNames.length > 0 && !activeTab) {
      setActiveTab(classNames[0]);
    }
  }, [classNames, activeTab]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [activeTab, codeMap]);

  const handleCopy = useCallback(() => {
    if (codeMap && activeTab && codeMap[activeTab]) {
      navigator.clipboard.writeText(codeMap[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [codeMap, activeTab]);

  const handleDownloadZip = useCallback(async () => {
    if (!codeMap) return;
    const zip = new JSZip();
    Object.entries(codeMap).forEach(([name, code]) => {
      zip.file(`${name}.java`, code);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'uml-generated-code.zip');
  }, [codeMap]);

  const togglePanel = () => {
    dispatch({ type: 'SET_CODE_PANEL', payload: !isOpen });
  };

  return (
    <div className={`code-panel glass-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="code-panel-handle" onClick={togglePanel}>
        <div className="handle-bar" />
        <span className="handle-label">
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          Generated Java Code
        </span>
        {isOpen && (
          <div className="handle-actions">
            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleDownloadZip(); }} title="Download ZIP">
              <Download size={14} />
            </button>
          </div>
        )}
      </div>

      {isOpen && codeMap && (
        <div className="code-panel-body">
          <div className="code-tabs">
            {classNames.map((name) => (
              <button
                key={name}
                className={`code-tab ${activeTab === name ? 'active' : ''}`}
                onClick={() => setActiveTab(name)}
              >
                {name}.java
              </button>
            ))}
          </div>
          <div className="code-content">
            <div className="code-actions">
              <button className="btn-copy" onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">
              <code ref={codeRef} className="language-java">
                {activeTab && codeMap[activeTab] ? codeMap[activeTab] : '// Select a class tab to view code'}
              </code>
            </pre>
          </div>
        </div>
      )}

      {isOpen && !codeMap && (
        <div className="code-panel-body">
          <div className="code-empty">
            <p>Click "Generate Code" in the toolbar to generate Java source code from your diagram.</p>
          </div>
        </div>
      )}
    </div>
  );
}
