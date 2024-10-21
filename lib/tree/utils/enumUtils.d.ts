export declare function getNames(e: any): string[];
export declare function getValues<T extends number>(e: any): T[];
export declare function getNamesForValues(e: any): {
    value: number;
    names: string[];
}[];
export declare function getEnumFlagLines(enumObj: any, value: number): string[] | null;
