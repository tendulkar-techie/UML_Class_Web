export const exportDiagram = (nodes, edges) => {
  const data = {
    version: '1.0',
    nodes,
    edges,
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importDiagram = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.version || !data.nodes || !data.edges) {
      throw new Error('Invalid diagram format. Missing required fields (version, nodes, edges).');
    }
    
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      throw new Error('Invalid diagram format. Nodes and edges must be arrays.');
    }
    
    return {
      nodes: data.nodes,
      edges: data.edges
    };
  } catch (error) {
    throw new Error(`Failed to import diagram: ${error.message}`);
  }
};

export const downloadJson = (jsonString, filename) => {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || 'diagram.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
