import { TreeMode } from "../types/index";
import { Node, SourceFile } from "./CompilerApi";
export declare function getChildrenFunction(mode: TreeMode, sourceFile: SourceFile): (node: Node) => readonly import("typescript").Node[];
