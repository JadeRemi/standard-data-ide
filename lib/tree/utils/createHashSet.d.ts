export declare function createHashSet<T>(): HashSet<T>;
export interface HashSet<T> {
    has(value: T): boolean;
    clear(): void;
    delete(value: T): boolean;
    add(value: T): void;
    values(): IterableIterator<T>;
}
export declare class Es5HashSet<T> implements HashSet<T> {
    private readonly items;
    has(value: T): boolean;
    add(value: T): void;
    delete(value: T): boolean;
    clear(): void;
    values(): Generator<T, void, unknown>;
}
