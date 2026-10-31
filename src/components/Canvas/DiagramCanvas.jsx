import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ClassNode from '../Nodes/ClassNode';
import UmlEdge from '../Edges/UmlEdge';
import { EdgeMarkerDefs } from '../../utils/edgeMarkers';
import { useDiagram } from '../../hooks/useDiagram';
import RelationshipModal from '../Modals/RelationshipModal';
import './DiagramCanvas.css';

const nodeTypes = { classNode: ClassNode };
const edgeTypes = { umlEdge: UmlEdge };

export default function DiagramCanvas() {
  const { state, dispatch } = useDiagram();
  const [showRelModal, setShowRelModal] = useState(false);
  const pendingConnection = useRef(null);

  const onNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          dispatch({ type: 'UPDATE_NODE_POSITION', payload: { nodeId: change.id, position: change.position } });
        }
        if (change.type === 'remove') {
          dispatch({ type: 'DELETE_NODE', payload: change.id });
        }
      });
      if (changes.some(c => c.type === 'select' && c.selected)) {
        const selected = changes.find(c => c.type === 'select' && c.selected);
        if (selected) dispatch({ type: 'SET_SELECTED_NODE', payload: selected.id });
      }
    },
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          dispatch({ type: 'DELETE_EDGE', payload: change.id });
        }
        if (change.type === 'select' && change.selected) {
          dispatch({ type: 'SET_SELECTED_EDGE', payload: change.id });
        }
      });
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (connection) => {
      if (state.relationshipMode) {
        dispatch({
          type: 'ADD_EDGE',
          payload: {
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
            data: {
              relationshipType: state.relationshipMode,
              label: '',
              sourceMultiplicity: '',
              targetMultiplicity: '',
            },
          },
        });
      } else {
        pendingConnection.current = connection;
        setShowRelModal(true);
      }
    },
    [dispatch, state.relationshipMode]
  );

  const handleRelModalSubmit = useCallback(
    (relData) => {
      if (pendingConnection.current) {
        dispatch({
          type: 'ADD_EDGE',
          payload: {
            source: pendingConnection.current.source,
            target: pendingConnection.current.target,
            sourceHandle: pendingConnection.current.sourceHandle,
            targetHandle: pendingConnection.current.targetHandle,
            data: relData,
          },
        });
        pendingConnection.current = null;
      }
      setShowRelModal(false);
    },
    [dispatch]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      dispatch({ type: 'SET_SELECTED_NODE', payload: node.id });
    },
    [dispatch]
  );

  const onEdgeClick = useCallback(
    (_, edge) => {
      dispatch({ type: 'SET_SELECTED_EDGE', payload: edge.id });
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: null });
    dispatch({ type: 'SET_SELECTED_EDGE', payload: null });
  }, [dispatch]);

  const nodesWithSelection = state.nodes.map((n) => ({
    ...n,
    selected: n.id === state.selectedNodeId,
  }));

  const edgesWithSelection = state.edges.map((e) => ({
    ...e,
    selected: e.id === state.selectedEdgeId,
  }));

  return (
    <div className="diagram-canvas">
      <EdgeMarkerDefs />
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edgesWithSelection}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode={['Delete', 'Backspace']}
        connectionLineStyle={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5,5' }}
        defaultEdgeOptions={{ type: 'umlEdge' }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-left" className="flow-controls" />
        <MiniMap
          nodeColor={(n) => {
            const s = n.data?.stereotype;
            if (s === 'interface') return '#8b5cf6';
            if (s === 'abstract') return '#f59e0b';
            if (s === 'enum') return '#10b981';
            return '#3b82f6';
          }}
          maskColor="rgba(10, 14, 26, 0.8)"
          className="flow-minimap"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(148, 163, 184, 0.15)" />
      </ReactFlow>

      {showRelModal && (
        <RelationshipModal
          onSubmit={handleRelModalSubmit}
          onClose={() => {
            setShowRelModal(false);
            pendingConnection.current = null;
          }}
        />
      )}
    </div>
  );
}
