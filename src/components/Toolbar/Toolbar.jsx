import React from 'react';
import { 
  Box, Diamond, Triangle, ArrowRight, ArrowDown, 
  Code, Download, Upload, Trash2, Hexagon, FileCode, GitBranch, CircleDot 
} from 'lucide-react';
import './Toolbar.css';

const Toolbar = ({ 
  onAddClass, 
  relationshipMode, 
  setRelationshipMode, 
  onGenerateCode, 
  onExport, 
  onImport, 
  onClear 
}) => {
  const handleRelationshipToggle = (type) => {
    setRelationshipMode(relationshipMode === type ? null : type);
  };

  return (
    <div className="toolbar-container glass-panel">
      <div className="toolbar-left">
        <div className="logo">
          <Hexagon size={24} />
          <span>UML Architect</span>
        </div>
      </div>
      
      <div className="toolbar-center">
        {/* Button Group 1: Add Elements */}
        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => onAddClass('class')} title="Add Class">
            <Box size={16} /> <span className="label">Class</span>
          </button>
          <button className="toolbar-btn" onClick={() => onAddClass('interface')} title="Add Interface">
            <CircleDot size={16} /> <span className="label">Interface</span>
          </button>
          <button className="toolbar-btn" onClick={() => onAddClass('abstract')} title="Add Abstract Class">
            <FileCode size={16} /> <span className="label">Abstract</span>
          </button>
          <button className="toolbar-btn" onClick={() => onAddClass('enum')} title="Add Enum">
            <GitBranch size={16} /> <span className="label">Enum</span>
          </button>
        </div>

        {/* Button Group 2: Relationships */}
        <div className="toolbar-group">
          <button 
            className={`toolbar-btn icon-only ${relationshipMode === 'association' ? 'active' : ''}`}
            onClick={() => handleRelationshipToggle('association')}
            title="Association"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            className={`toolbar-btn icon-only ${relationshipMode === 'aggregation' ? 'active' : ''}`}
            onClick={() => handleRelationshipToggle('aggregation')}
            title="Aggregation"
          >
            <Diamond size={16} style={{ fill: 'transparent' }} />
          </button>
          <button 
            className={`toolbar-btn icon-only ${relationshipMode === 'composition' ? 'active' : ''}`}
            onClick={() => handleRelationshipToggle('composition')}
            title="Composition"
          >
            <Diamond size={16} style={{ fill: 'currentColor' }} />
          </button>
          <button 
            className={`toolbar-btn icon-only ${relationshipMode === 'inheritance' ? 'active' : ''}`}
            onClick={() => handleRelationshipToggle('inheritance')}
            title="Inheritance"
          >
            <Triangle size={16} style={{ fill: 'transparent' }} />
          </button>
          <button 
            className={`toolbar-btn icon-only ${relationshipMode === 'implementation' ? 'active' : ''}`}
            onClick={() => handleRelationshipToggle('implementation')}
            title="Implementation"
          >
            <ArrowDown size={16} style={{ borderStyle: 'dashed' }} />
          </button>
          <button 
            className={`toolbar-btn icon-only ${relationshipMode === 'dependency' ? 'active' : ''}`}
            onClick={() => handleRelationshipToggle('dependency')}
            title="Dependency"
          >
            <ArrowRight size={16} strokeDasharray="4 4" />
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        {/* Button Group 3: Actions */}
        <div className="toolbar-group">
          <button className="toolbar-btn primary" onClick={onGenerateCode} title="Generate Code">
            <Code size={16} /> <span className="label">Generate</span>
          </button>
          <button className="toolbar-btn icon-only" onClick={onExport} title="Export JSON">
            <Download size={16} />
          </button>
          <button className="toolbar-btn icon-only" onClick={onImport} title="Import JSON">
            <Upload size={16} />
          </button>
          <button className="toolbar-btn danger icon-only" onClick={onClear} title="Clear All">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
