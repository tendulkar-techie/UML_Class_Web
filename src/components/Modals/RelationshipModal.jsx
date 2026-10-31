import { useState } from 'react';
import { RELATIONSHIP_TYPES } from '../../constants/defaults';
import './RelationshipModal.css';

export default function RelationshipModal({ onSubmit, onClose }) {
  const [selectedType, setSelectedType] = useState('association');
  const [label, setLabel] = useState('');
  const [sourceMultiplicity, setSourceMultiplicity] = useState('');
  const [targetMultiplicity, setTargetMultiplicity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      relationshipType: selectedType,
      label,
      sourceMultiplicity,
      targetMultiplicity,
    });
  };

  const relIcons = {
    association: '→',
    aggregation: '◇→',
    composition: '◆→',
    inheritance: '△',
    implementation: '⊳',
    dependency: '⇢',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Create Relationship</h3>

        <form onSubmit={handleSubmit}>
          <div className="relationship-options">
            {RELATIONSHIP_TYPES.map((rel) => (
              <label
                key={rel.value}
                className={`relationship-option ${selectedType === rel.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="relType"
                  value={rel.value}
                  checked={selectedType === rel.value}
                  onChange={() => setSelectedType(rel.value)}
                />
                <span className="rel-icon">{relIcons[rel.value]}</span>
                <div className="rel-info">
                  <span className="rel-label">{rel.label}</span>
                  <span className="rel-desc">{rel.description}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="modal-fields">
            <div className="form-group">
              <label>Label (optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. uses, manages"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Source Multiplicity</label>
                <input
                  type="text"
                  value={sourceMultiplicity}
                  onChange={(e) => setSourceMultiplicity(e.target.value)}
                  placeholder="e.g. 1"
                />
              </div>
              <div className="form-group">
                <label>Target Multiplicity</label>
                <input
                  type="text"
                  value={targetMultiplicity}
                  onChange={(e) => setTargetMultiplicity(e.target.value)}
                  placeholder="e.g. 0..*"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
