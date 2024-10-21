import { CompilerApi, CompilerPackageNames, Node, Program, ScriptKind, ScriptTarget, SourceFile, TypeChecker } from "../compiler/index";
export interface StoreState {
    code: string;
    options: OptionsState;
    apiLoadingState: ApiLoadingState;
    compiler: CompilerState | undefined;
}
export interface CompilerState {
    packageName: CompilerPackageNames;
    api: CompilerApi;
    sourceFile: SourceFile;
    selectedNode: Node;
    bindingTools: () => BindingTools;
}
export interface BindingTools {
    program: Program;
    typeChecker: TypeChecker;
}
export interface OptionsState {
    compilerPackageName: CompilerPackageNames;
    treeMode: TreeMode;
    scriptTarget: ScriptTarget;
    scriptKind: ScriptKind;
    bindingEnabled: boolean;
    showFactoryCode: boolean;
    showInternals: boolean;
    theme: Theme;
}
export declare enum ApiLoadingState {
    Loading = 0,
    Loaded = 1,
    Error = 2
}
export declare enum TreeMode {
    forEachChild = 0,
    getChildren = 1
}
export declare enum Theme {
    OS = "os",
    Dark = "dark",
    Light = "light"
}
