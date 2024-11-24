import { CompilerApi, Node, Program, SourceFile, TypeChecker } from "./compiler/index";
import { TreeMode } from "./types/index";
export interface TreeViewerProps {
    api: CompilerApi;
    sourceFile: SourceFile;
    selectedNode: Node;
    onSelectNode: (node: Node) => void;
    mode: TreeMode;
    bindingTools: () => {
        typeChecker: TypeChecker;
        program: Program;
    };
}
export declare function treeSampler(props: TreeViewerProps): Promise<string | {
    [x: string]: any[] | {
        Node: {
            [x: string]: {
                [x: string]: any;
                properties: any;
                "getChildCount()": number;
                "getFullStart()": {
                    position: string;
                    line: number;
                    column: number;
                };
                "getStart()": {
                    position: string;
                    line: number;
                    column: number;
                };
                "getStart(sourceFile, true)": {
                    position: string;
                    line: number;
                    column: number;
                };
                "getFullWidth()": number;
                "getWidth()": number;
                "getLeadingTriviaWidth()": number;
                "getFullText()": string;
                "getText()": string;
            };
        };
        Binding: {
            Type: string | {
                [x: string]: any;
            };
            Symbol: string | {
                [x: string]: any;
            };
        };
    };
    __node: {
        Node: {
            [x: string]: {
                [x: string]: any;
                properties: any;
                "getChildCount()": number;
                "getFullStart()": {
                    position: string;
                    line: number;
                    column: number;
                };
                "getStart()": {
                    position: string;
                    line: number;
                    column: number;
                };
                "getStart(sourceFile, true)": {
                    position: string;
                    line: number;
                    column: number;
                };
                "getFullWidth()": number;
                "getWidth()": number;
                "getLeadingTriviaWidth()": number;
                "getFullText()": string;
                "getText()": string;
            };
        };
        Binding: {
            Type: string | {
                [x: string]: any;
            };
            Symbol: string | {
                [x: string]: any;
            };
        };
    };
}>;
