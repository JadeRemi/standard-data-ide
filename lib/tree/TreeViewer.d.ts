import { CompilerApi, Node, SourceFile } from "./compiler/index";
import { TreeMode } from "./types/index";
export interface TreeViewerProps {
    api: CompilerApi;
    sourceFile: SourceFile;
    selectedNode: Node;
    onSelectNode: (node: Node) => void;
    mode: TreeMode;
}
export declare function TreeViewer(props: TreeViewerProps): any;
