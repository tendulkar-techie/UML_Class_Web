export const DEFAULT_CLASS_DATA = {
  className: 'NewClass',
  stereotype: 'class',
  attributes: [],
  methods: []
};

export const STEREOTYPE_OPTIONS = [
  { value: 'class', label: 'Class' },
  { value: 'abstract', label: 'Abstract Class' },
  { value: 'interface', label: 'Interface' },
  { value: 'enum', label: 'Enum' }
];

export const VISIBILITY_OPTIONS = [
  { value: '+', label: 'public' },
  { value: '-', label: 'private' },
  { value: '#', label: 'protected' },
  { value: '~', label: 'package' }
];

export const RELATIONSHIP_TYPES = [
  { value: 'association', label: 'Association', description: 'A relationship between two classes' },
  { value: 'aggregation', label: 'Aggregation', description: 'A "has-a" relationship where the child can exist independently' },
  { value: 'composition', label: 'Composition', description: 'A strong "has-a" relationship where the child lifecycle is tied to the parent' },
  { value: 'inheritance', label: 'Inheritance', description: 'An "is-a" relationship (extends)' },
  { value: 'implementation', label: 'Implementation', description: 'Implementing an interface' },
  { value: 'dependency', label: 'Dependency', description: 'A uses-a relationship' }
];

export const JAVA_TYPES = [
  'int', 'long', 'float', 'double', 'boolean', 'char', 'String', 'void', 'Object', 'List', 'Map', 'Set'
];

export const DEFAULT_POSITIONS = () => ({
  x: 100 + Math.random() * 400,
  y: 100 + Math.random() * 300
});
