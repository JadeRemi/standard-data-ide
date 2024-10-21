export interface LineNumberAndColumn {
    pos: number;
    number: number;
    length: number;
}
export declare function createLineNumberAndColumns(text: string): LineNumberAndColumn[];
