export const generateJavaCode = (nodes, edges) => {
    const codeMap = new Map();

    const nodeMap = new Map();
    nodes.forEach(node => {
        nodeMap.set(node.id, node);
    });

    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getVisibility = (vis) => {
        switch (vis) {
            case '+': return 'public ';
            case '-': return 'private ';
            case '#': return 'protected ';
            case '~': return '';
            default: return '';
        }
    };

    const getDefaultValue = (type) => {
        if (['int', 'long', 'float', 'double', 'short', 'byte'].includes(type)) return '0';
        if (type === 'boolean') return 'false';
        if (type === 'char') return "'\\u0000'";
        if (type === 'void') return '';
        return 'null';
    };

    nodes.forEach(node => {
        const { className, stereotype, attributes, methods } = node.data;
        if (!className) return;

        let code = '';
        let imports = new Set();
        let classDeclaration = '';

        const nodeEdges = edges.filter(e => e.source === node.id || e.target === node.id);

        let extendsClass = null;
        let implementsInterfaces = [];
        let fieldsFromEdges = [];
        let dependencies = [];

        nodeEdges.forEach(edge => {
            if (edge.source === node.id) {
                const targetNode = nodeMap.get(edge.target);
                if (!targetNode) return;
                const targetName = targetNode.data.className;
                
                const type = edge.data?.relationshipType;
                
                if (type === 'inheritance') {
                    extendsClass = targetName;
                } else if (type === 'implementation') {
                    implementsInterfaces.push(targetName);
                } else if (type === 'aggregation' || type === 'composition') {
                    imports.add('java.util.List');
                    imports.add('java.util.ArrayList');
                    const fieldName = targetName.charAt(0).toLowerCase() + targetName.slice(1) + 's';
                    fieldsFromEdges.push({
                        type: `List<${targetName}>`,
                        name: fieldName,
                        initializer: 'new ArrayList<>()',
                        isList: true,
                        relationship: type,
                        targetName: targetName
                    });
                } else if (type === 'association') {
                    const fieldName = targetName.charAt(0).toLowerCase() + targetName.slice(1);
                    fieldsFromEdges.push({
                        type: targetName,
                        name: fieldName,
                        initializer: null,
                        isList: false,
                        relationship: type,
                        targetName: targetName
                    });
                } else if (type === 'dependency') {
                    dependencies.push(targetName);
                }
            }
        });

        // Generate class-level comment
        code += `/**\n * Auto-generated code for ${className}\n */\n`;

        // Generate modifiers and declaration
        if (stereotype === 'abstract') {
            classDeclaration = `public abstract class ${className}`;
        } else if (stereotype === 'interface') {
            classDeclaration = `public interface ${className}`;
        } else if (stereotype === 'enum') {
            classDeclaration = `public enum ${className}`;
        } else {
            classDeclaration = `public class ${className}`;
        }

        if (extendsClass) {
            classDeclaration += ` extends ${extendsClass}`;
        }
        if (implementsInterfaces.length > 0) {
            classDeclaration += ` implements ${implementsInterfaces.join(', ')}`;
        }

        // Imports
        if (imports.size > 0) {
            const importList = Array.from(imports).sort();
            const importStr = importList.map(i => `import ${i};`).join('\n');
            code = importStr + '\n\n' + code;
        }

        code += `${classDeclaration} {\n\n`;

        if (stereotype === 'enum') {
            const enumConstants = attributes.map(attr => attr.name).join(',\n    ');
            if (enumConstants) {
                code += `    ${enumConstants};\n\n`;
            }
        }

        // Add Dependency comments
        if (dependencies.length > 0) {
            dependencies.forEach(dep => {
                code += `    // Depends on ${dep}\n`;
            });
            code += '\n';
        }

        let privateFieldsToGenerateGettersSetters = [];

        // Attributes
        if (stereotype !== 'enum' || attributes.some(attr => attr.type)) {
            attributes.forEach(attr => {
                if (stereotype === 'enum' && !attr.type) return; 

                const isInterface = stereotype === 'interface';
                let modifiers = '';
                
                if (isInterface) {
                    modifiers = '    '; 
                } else {
                    modifiers = '    ' + getVisibility(attr.visibility) + (attr.isStatic ? 'static ' : '');
                }

                code += `${modifiers}${attr.type} ${attr.name};\n`;
                
                if (attr.visibility === '-' && !isInterface && stereotype !== 'enum') {
                    privateFieldsToGenerateGettersSetters.push(attr);
                }
            });
            if (attributes.length > 0) code += '\n';
        }

        // Fields from Edges (Aggregation, Composition, Association)
        if (fieldsFromEdges.length > 0) {
            fieldsFromEdges.forEach(field => {
                if (field.relationship === 'composition') {
                    code += `    // Composition - lifecycle managed\n`;
                }
                const initializerStr = field.initializer ? ` = ${field.initializer}` : '';
                code += `    private ${field.type} ${field.name}${initializerStr};\n`;
                
                if (stereotype !== 'interface' && stereotype !== 'enum') {
                    privateFieldsToGenerateGettersSetters.push({
                        name: field.name,
                        type: field.type,
                        visibility: '-'
                    });
                }
            });
            code += '\n';
        }

        // Methods
        methods.forEach(method => {
            const isInterface = stereotype === 'interface';
            let modifiers = '    ';
            
            if (!isInterface) {
                modifiers += getVisibility(method.visibility);
                if (method.isStatic) modifiers += 'static ';
                if (method.isAbstract && stereotype === 'abstract') modifiers += 'abstract ';
            }

            const paramStr = method.parameters || '';
            const returnType = method.returnType || 'void';
            const methodDecl = `${modifiers}${returnType} ${method.name}(${paramStr})`;

            if (isInterface || method.isAbstract) {
                code += `${methodDecl};\n\n`;
            } else {
                code += `${methodDecl} {\n`;
                code += `        // TODO: implement\n`;
                if (returnType !== 'void') {
                    code += `        return ${getDefaultValue(returnType)};\n`;
                }
                code += `    }\n\n`;
            }
        });

        // Getters and Setters
        if (privateFieldsToGenerateGettersSetters.length > 0 && stereotype !== 'interface' && stereotype !== 'enum') {
            privateFieldsToGenerateGettersSetters.forEach(field => {
                const capitalizedName = capitalize(field.name);
                
                // Getter
                code += `    public ${field.type} get${capitalizedName}() {\n`;
                code += `        return this.${field.name};\n`;
                code += `    }\n\n`;

                // Setter
                code += `    public void set${capitalizedName}(${field.type} ${field.name}) {\n`;
                code += `        this.${field.name} = ${field.name};\n`;
                code += `    }\n\n`;
            });
        }

        code += `}\n`;
        codeMap.set(className, code);
    });

    return codeMap;
};
