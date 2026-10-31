import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './ClassNode.css';

const visibilitySymbol = (v) => {
  switch (v) {
    case '+': return '+';
    case '-': return '−';
    case '#': return '#';
    case '~': return '~';
    default: return '+';
  }
};

function ClassNode({ data, selected }) {
  const { className, stereotype, attributes = [], methods = [] } = data;

  const stereotypeLabel = {
    class: null,
    interface: '«interface»',
    abstract: '«abstract»',
    enum: '«enumeration»',
  };

  return (
    <div className={`uml-class-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} id="top" className="node-handle" />
      <Handle type="source" position={Position.Top} id="top-src" className="node-handle" style={{ left: '60%' }} />
      <Handle type="target" position={Position.Bottom} id="bottom" className="node-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom-src" className="node-handle" style={{ left: '60%' }} />
      <Handle type="target" position={Position.Left} id="left" className="node-handle" />
      <Handle type="source" position={Position.Left} id="left-src" className="node-handle" style={{ top: '60%' }} />
      <Handle type="target" position={Position.Right} id="right" className="node-handle" />
      <Handle type="source" position={Position.Right} id="right-src" className="node-handle" style={{ top: '60%' }} />

      {/* Header */}
      <div className={`uml-node-header stereotype-${stereotype}`}>
        {stereotypeLabel[stereotype] && (
          <span className="stereotype-badge">{stereotypeLabel[stereotype]}</span>
        )}
        <div className={`class-name ${stereotype === 'abstract' ? 'abstract-name' : ''}`}>
          {className}
        </div>
      </div>

      <div className="uml-divider" />

      {/* Attributes */}
      <div className="uml-section">
        {attributes.length === 0 ? (
          <div className="empty-placeholder">no attributes</div>
        ) : (
          attributes.map((attr) => (
            <div key={attr.id} className={`uml-member ${attr.isStatic ? 'static-member' : ''}`}>
              <span className="visibility">{visibilitySymbol(attr.visibility)}</span>{' '}
              <span className="member-name">{attr.name}</span>
              {attr.type && <span className="member-type"> : {attr.type}</span>}
            </div>
          ))
        )}
      </div>

      <div className="uml-divider" />

      {/* Methods */}
      <div className="uml-section">
        {methods.length === 0 ? (
          <div className="empty-placeholder">no methods</div>
        ) : (
          methods.map((method) => (
            <div
              key={method.id}
              className={`uml-member ${method.isStatic ? 'static-member' : ''} ${method.isAbstract ? 'abstract-member' : ''}`}
            >
              <span className="visibility">{visibilitySymbol(method.visibility)}</span>{' '}
              <span className="member-name">
                {method.name}({method.parameters || ''})
              </span>
              {method.returnType && <span className="member-type"> : {method.returnType}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default memo(ClassNode);
