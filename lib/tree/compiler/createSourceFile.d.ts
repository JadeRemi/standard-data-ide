import { CompilerApi, Program, ScriptKind, ScriptTarget, TypeChecker } from "./CompilerApi";
export declare function createSourceFile(api: CompilerApi, code: string, scriptTarget: ScriptTarget, scriptKind: ScriptKind): {
    sourceFile: import("typescript").SourceFile;
    bindingTools: () => {
        typeChecker: TypeChecker;
        program: Program;
    };
};
