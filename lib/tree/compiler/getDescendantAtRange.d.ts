import { TreeMode } from "../types/index";
import { CompilerApi, SourceFile } from "./CompilerApi";
export declare function getDescendantAtRange(mode: TreeMode, sourceFile: SourceFile, range: [number, number], compilerApi: CompilerApi): import("typescript").Node;
