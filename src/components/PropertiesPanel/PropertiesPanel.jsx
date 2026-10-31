import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDiagram } from '../../hooks/useDiagram';
import { VISIBILITY_OPTIONS, STEREOTYPE_OPTIONS, JAVA_TYPES } from '../../constants/defaults';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import './PropertiesPanel.css';

export default function PropertiesPanel() {
  const { state, dispatch } = useDiagram();
  const selectedNode = state.nodes.find((n) => n.id === state.selectedNodeId);
  const selectedEdge = state.edges.find((e) => e.id === state.selectedEdgeId);

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="properties-panel glass-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        <div className="empty-state">
          <p>Select a class or relationship to edit its properties</p>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="properties-panel glass-panel">
        <div className="panel-header">
          <h3>Relationship</h3>
        </div>
        <div className="panel-content">
          <div className="form-group">
            <label>Type</label>
            <div className="rel-type-badge">{selectedEdge.data?.relationshipType}</div>
          </div>
          <div className="form-group">
            <label>Label</label>
            <input
              type="text"
              value={selectedEdge.data?.label || ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_EDGE',
                  payload: { edgeId: selectedEdge.id, data: { label: e.target.value } },
                })
              }
              placeholder="e.g. uses, has"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Source Multiplicity</label>
              <input
                type="text"
                value={selectedEdge.data?.sourceMultiplicity || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_EDGE',
                    payload: { edgeId: selectedEdge.id, data: { sourceMultiplicity: e.target.value } },
                  })
                }
                placeholder="e.g. 1, 0..*"
              />
            </div>
            <div className="form-group">
              <label>Target Multiplicity</label>
              <input
                type="text"
                value={selectedEdge.data?.targetMultiplicity || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_EDGE',
                    payload: { edgeId: selectedEdge.id, data: { targetMultiplicity: e.target.value } },
                  })
                }
                placeholder="e.g. *, 1..n"
              />
            </div>
          </div>
          <button
            className="btn-danger"
            onClick={() => dispatch({ type: 'DELETE_EDGE', payload: selectedEdge.id })}
          >
            <Trash2 size={14} /> Delete Relationship
          </button>
        </div>
      </div>
    );
  }

  const nodeData = selectedNode.data;

  const updateData = (newData) => {
    dispatch({ type: 'UPDATE_NODE_DATA', payload: { nodeId: selectedNode.id, data: newData } });
  };

  const addAttribute = () => {
    const attrs = [...(nodeData.attributes || []), { id: uuidv4(), visibility: '-', name: 'newField', type: 'String', isStatic: false }];
    updateData({ attributes: attrs });
  };

  const updateAttribute = (attrId, field, value) => {
    const attrs = nodeData.attributes.map((a) => (a.id === attrId ? { ...a, [field]: value } : a));
    updateData({ attributes: attrs });
  };

  const removeAttribute = (attrId) => {
    updateData({ attributes: nodeData.attributes.filter((a) => a.id !== attrId) });
  };

  const addMethod = () => {
    const methods = [
      ...(nodeData.methods || []),
      { id: uuidv4(), visibility: '+', name: 'newMethod', returnType: 'void', parameters: '', isStatic: false, isAbstract: false },
    ];
    updateData({ methods });
  };

  const updateMethod = (methodId, field, value) => {
    const methods = nodeData.methods.map((m) => (m.id === methodId ? { ...m, [field]: value } : m));
    updateData({ methods });
  };

  const removeMethod = (methodId) => {
    updateData({ methods: nodeData.methods.filter((m) => m.id !== methodId) });
  };

  return (
    <div className="properties-panel glass-panel">
      <div className="panel-header">
        <h3>Class Properties</h3>
      </div>
      <div className="panel-content">
        {/* Class Name */}
        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            value={nodeData.className}
            onChange={(e) => updateData({ className: e.target.value })}
          />
        </div>

        {/* Stereotype */}
        <div className="form-group">
          <label>Stereotype</label>
          <select
            value={nodeData.stereotype}
            onChange={(e) => updateData({ stereotype: e.target.value })}
          >
            {STEREOTYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Attributes */}
        <div className="section-header">
          <h4>Attributes</h4>
          <button className="btn-icon" onClick={addAttribute} title="Add Attribute">
            <Plus size={14} />
          </button>
        </div>
        <div className="members-list">
          {(nodeData.attributes || []).map((attr) => (
            <div key={attr.id} className="member-row">
              <select
                className="visibility-select"
                value={attr.visibility}
                onChange={(e) => updateAttribute(attr.id, 'visibility', e.target.value)}
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.value}
                  </option>
                ))}
              </select>
              <input
                className="member-name-input"
                type="text"
                value={attr.name}
                onChange={(e) => updateAttribute(attr.id, 'name', e.target.value)}
                placeholder="name"
              />
              <input
                className="member-type-input"
                type="text"
                value={attr.type}
                onChange={(e) => updateAttribute(attr.id, 'type', e.target.value)}
                placeholder="type"
                list="java-types"
              />
              <label className="static-toggle" title="Static">
                <input
                  type="checkbox"
                  checked={attr.isStatic}
                  onChange={(e) => updateAttribute(attr.id, 'isStatic', e.target.checked)}
                />
                <span className="static-label">S</span>
              </label>
              <button className="btn-icon btn-delete" onClick={() => removeAttribute(attr.id)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {(nodeData.attributes || []).length === 0 && (
            <button className="btn-add-member" onClick={addAttribute}>
              <Plus size={14} /> Add Attribute
            </button>
          )}
        </div>

        {/* Methods */}
        <div className="section-header">
          <h4>Methods</h4>
          <button className="btn-icon" onClick={addMethod} title="Add Method">
            <Plus size={14} />
          </button>
        </div>
        <div className="members-list">
          {(nodeData.methods || []).map((method) => (
            <div key={method.id} className="member-row method-row">
              <select
                className="visibility-select"
                value={method.visibility}
                onChange={(e) => updateMethod(method.id, 'visibility', e.target.value)}
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.value}
                  </option>
                ))}
              </select>
              <input
                className="member-name-input"
                type="text"
                value={method.name}
                onChange={(e) => updateMethod(method.id, 'name', e.target.value)}
                placeholder="name"
              />
              <input
                className="member-type-input"
                type="text"
                value={method.returnType}
                onChange={(e) => updateMethod(method.id, 'returnType', e.target.value)}
                placeholder="return"
                list="java-types"
              />
              <input
                className="params-input"
                type="text"
                value={method.parameters}
                onChange={(e) => updateMethod(method.id, 'parameters', e.target.value)}
                placeholder="params"
              />
              <div className="method-toggles">
                <label className="static-toggle" title="Static">
                  <input
                    type="checkbox"
                    checked={method.isStatic}
                    onChange={(e) => updateMethod(method.id, 'isStatic', e.target.checked)}
                  />
                  <span className="static-label">S</span>
                </label>
                <label className="static-toggle" title="Abstract">
                  <input
                    type="checkbox"
                    checked={method.isAbstract}
                    onChange={(e) => updateMethod(method.id, 'isAbstract', e.target.checked)}
                  />
                  <span className="static-label">A</span>
                </label>
              </div>
              <button className="btn-icon btn-delete" onClick={() => removeMethod(method.id)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {(nodeData.methods || []).length === 0 && (
            <button className="btn-add-member" onClick={addMethod}>
              <Plus size={14} /> Add Method
            </button>
          )}
        </div>

        {/* Delete Node */}
        <button
          className="btn-danger"
          onClick={() => dispatch({ type: 'DELETE_NODE', payload: selectedNode.id })}
        >
          <Trash2 size={14} /> Delete Class
        </button>
      </div>

      <datalist id="java-types">
        {JAVA_TYPES.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>
    </div>
  );
}
