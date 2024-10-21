export declare function binarySearch<T>(items: ReadonlyArray<T>, compareTo: (value: T) => number): number;
export declare function partition<T>(items: ReadonlyArray<T>, predicate: (value: T) => boolean): [T[], T[]];
