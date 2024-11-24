import { CompilerApi, Node, SourceFile } from "./compiler";
import { BindingTools } from "./types";
export interface PropertiesViewerProps {
    api: CompilerApi;
    sourceFile: SourceFile;
    bindingTools: () => BindingTools;
    selectedNode: Node;
}
export declare function propertiesSampler(props: PropertiesViewerProps): Promise<{
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
}>;
