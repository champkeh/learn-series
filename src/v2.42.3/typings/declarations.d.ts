// internal
declare module 'help.md' {
	const str: string;
	export default str;
}

// external libs
declare module 'acorn-static-class-features' {
	const plugin: (BaseParser: typeof acorn.Parser) => typeof acorn.Parser;
	export default plugin;
}

declare module 'acorn-class-fields' {
	const plugin: (BaseParser: typeof acorn.Parser) => typeof acorn.Parser;
	export default plugin;
}

declare module 'fsevents' {
	export default {};
}

declare module 'acorn-walk' {
	type WalkerCallback<TState> = (node: acorn.Node, state: TState) => void;
	type RecursiveWalkerFn<TState> = (
		node: acorn.Node,
		state: TState,
		callback: WalkerCallback<TState>
	) => void;
	export type BaseWalker<TState> = Record<string, RecursiveWalkerFn<TState>>;
	export const base: BaseWalker<unknown>
}

declare module 'is-reference' {
	export default function is_reference(node: NodeWithFieldDefinition, parent: NodeWithFieldDefinition): any;
	export type Node = import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").ImportExpression | import("estree").ChainExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier;
	export type NodeWithFieldDefinition = import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").ImportExpression | import("estree").ChainExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | {
		computed: boolean;
		type: 'FieldDefinition';
		value: Node;
	};
}
