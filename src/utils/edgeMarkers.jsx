import React from 'react';

export const EdgeMarkerDefs = () => (
  <svg width="0" height="0">
    <defs>
      <marker
        id="marker-arrow-open"
        markerWidth="12"
        markerHeight="12"
        refX="10"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      </marker>
      
      <marker
        id="marker-triangle-hollow"
        markerWidth="14"
        markerHeight="14"
        refX="14"
        refY="7"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 14 7 L 2 12 Z" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
      </marker>

      <marker
        id="marker-diamond-hollow"
        markerWidth="16"
        markerHeight="12"
        refX="16"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 0 6 L 8 2 L 16 6 L 8 10 Z" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
      </marker>

      <marker
        id="marker-diamond-filled"
        markerWidth="16"
        markerHeight="12"
        refX="16"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 0 6 L 8 2 L 16 6 L 8 10 Z" fill="#94a3b8" stroke="#94a3b8" strokeWidth="1.5" />
      </marker>
    </defs>
  </svg>
);

export const getEdgeMarkerConfig = (relationshipType) => {
  let markerEnd = '';
  let style = { stroke: '#94a3b8', strokeWidth: 1.5 };
  
  switch (relationshipType) {
    case 'association':
      markerEnd = 'url(#marker-arrow-open)';
      break;
    case 'dependency':
      markerEnd = 'url(#marker-arrow-open)';
      style.strokeDasharray = '5,5';
      break;
    case 'inheritance':
      markerEnd = 'url(#marker-triangle-hollow)';
      break;
    case 'implementation':
      markerEnd = 'url(#marker-triangle-hollow)';
      style.strokeDasharray = '5,5';
      break;
    case 'aggregation':
      markerEnd = 'url(#marker-diamond-hollow)';
      break;
    case 'composition':
      markerEnd = 'url(#marker-diamond-filled)';
      break;
    default:
      break;
  }
  
  return { markerEnd, style };
};
