import Identifier from './Identifier';
import * as NodeType from './NodeType';
import { NodeBase } from './shared/Node';

export default class ExportSpecifier extends NodeBase {
	exported!: Identifier;
	local!: Identifier;
	type!: NodeType.tExportSpecifier;
}
