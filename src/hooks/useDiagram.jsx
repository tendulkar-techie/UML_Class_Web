import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CLASS_DATA, DEFAULT_POSITIONS } from '../constants/defaults';

const DiagramContext = createContext(null);

const initialState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  relationshipMode: null,
  codePanelOpen: false,
  generatedCode: null,
  history: [],
  historyIndex: -1,
};

function pushHistory(state) {
  const snapshot = { nodes: JSON.parse(JSON.stringify(state.nodes)), edges: JSON.parse(JSON.stringify(state.edges)) };
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);
  if (newHistory.length > 50) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

function diagramReducer(state, action) {
  switch (action.type) {
    case 'ADD_CLASS': {
      const id = uuidv4();
      const pos = DEFAULT_POSITIONS();
      const stereotype = action.payload?.stereotype || 'class';
      const classNames = { class: 'NewClass', interface: 'NewInterface', abstract: 'AbstractClass', enum: 'NewEnum' };
      const newNode = {
        id,
        type: 'classNode',
        position: pos,
        data: { ...DEFAULT_CLASS_DATA, className: classNames[stereotype] || 'NewClass', stereotype },
      };
      const newState = { ...state, nodes: [...state.nodes, newNode], selectedNodeId: id };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'UPDATE_NODE_DATA': {
      const { nodeId, data } = action.payload;
      const nodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      );
      const newState = { ...state, nodes };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'UPDATE_NODE_POSITION': {
      const { nodeId, position } = action.payload;
      const nodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, position } : n
      );
      return { ...state, nodes };
    }

    case 'DELETE_NODE': {
      const nodeId = action.payload;
      const nodes = state.nodes.filter((n) => n.id !== nodeId);
      const edges = state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      const newState = {
        ...state,
        nodes,
        edges,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'ADD_EDGE': {
      const edge = action.payload;
      const exists = state.edges.find(
        (e) => e.source === edge.source && e.target === edge.target && e.data?.relationshipType === edge.data?.relationshipType
      );
      if (exists) return state;
      const newEdge = { ...edge, id: edge.id || uuidv4(), type: 'umlEdge' };
      const newState = { ...state, edges: [...state.edges, newEdge] };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'UPDATE_EDGE': {
      const { edgeId, data } = action.payload;
      const edges = state.edges.map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
      );
      const newState = { ...state, edges };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'DELETE_EDGE': {
      const edgeId = action.payload;
      const edges = state.edges.filter((e) => e.id !== edgeId);
      const newState = {
        ...state,
        edges,
        selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
      };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.payload, selectedEdgeId: null };

    case 'SET_SELECTED_EDGE':
      return { ...state, selectedEdgeId: action.payload, selectedNodeId: null };

    case 'SET_RELATIONSHIP_MODE':
      return { ...state, relationshipMode: action.payload };

    case 'SET_CODE_PANEL':
      return { ...state, codePanelOpen: action.payload };

    case 'SET_GENERATED_CODE':
      return { ...state, generatedCode: action.payload, codePanelOpen: true };

    case 'SET_NODES':
      return { ...state, nodes: action.payload };

    case 'SET_EDGES':
      return { ...state, edges: action.payload };

    case 'IMPORT': {
      const { nodes, edges } = action.payload;
      const newState = { ...state, nodes, edges, selectedNodeId: null, selectedEdgeId: null };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'CLEAR': {
      const newState = { ...state, nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null, generatedCode: null };
      return { ...newState, ...pushHistory(newState) };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const snapshot = state.history[newIndex];
      return {
        ...state,
        nodes: JSON.parse(JSON.stringify(snapshot.nodes)),
        edges: JSON.parse(JSON.stringify(snapshot.edges)),
        historyIndex: newIndex,
        selectedNodeId: null,
        selectedEdgeId: null,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const snapshot = state.history[newIndex];
      return {
        ...state,
        nodes: JSON.parse(JSON.stringify(snapshot.nodes)),
        edges: JSON.parse(JSON.stringify(snapshot.edges)),
        historyIndex: newIndex,
        selectedNodeId: null,
        selectedEdgeId: null,
      };
    }

    default:
      return state;
  }
}

export function DiagramProvider({ children }) {
  const [state, dispatch] = useReducer(diagramReducer, initialState);

  return (
    <DiagramContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) throw new Error('useDiagram must be used within DiagramProvider');
  return context;
}
