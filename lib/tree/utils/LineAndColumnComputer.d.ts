/** An efficient way to compute the line and column of a position in a string. */
export declare class LineAndColumnComputer {
    readonly text: string;
    private lineInfos;
    constructor(text: string);
    getNumberAndColumnFromPos(pos: number): {
        lineNumber: number;
        column: number;
    };
    getPosFromLineAndColumn(line: number, column: number): number;
}
