import { memo } from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import { getEdgeMarkerConfig } from '../../utils/edgeMarkers';
import './UmlEdge.css';

function UmlEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) {
  const relType = data?.relationshipType || 'association';
  const markerConfig = getEdgeMarkerConfig(relType);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isDashed = relType === 'dependency' || relType === 'implementation';

  return (
    <>
      <path
        id={id}
        className={`uml-edge-path ${selected ? 'selected' : ''}`}
        d={edgePath}
        fill="none"
        stroke={selected ? '#06b6d4' : '#94a3b8'}
        strokeWidth={selected ? 2.5 : 1.8}
        strokeDasharray={isDashed ? '8,4' : 'none'}
        markerEnd={markerConfig.markerEnd}
        markerStart={markerConfig.markerStart}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />
      <EdgeLabelRenderer>
        {data?.label && (
          <div
            className="edge-label"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 14}px)`,
              pointerEvents: 'all',
            }}
          >
            {data.label}
          </div>
        )}
        {data?.sourceMultiplicity && (
          <div
            className="edge-multiplicity"
            style={{
              transform: `translate(-50%, -50%) translate(${sourceX + (targetX > sourceX ? 20 : -20)}px,${sourceY - 14}px)`,
              pointerEvents: 'none',
            }}
          >
            {data.sourceMultiplicity}
          </div>
        )}
        {data?.targetMultiplicity && (
          <div
            className="edge-multiplicity"
            style={{
              transform: `translate(-50%, -50%) translate(${targetX + (sourceX > targetX ? 20 : -20)}px,${targetY - 14}px)`,
              pointerEvents: 'none',
            }}
          >
            {data.targetMultiplicity}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(UmlEdge);
