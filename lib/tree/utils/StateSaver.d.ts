import { Theme, TreeMode } from "../types/index";
export interface VersionedState {
    version: 1 | 2 | 3 | 4;
}
export interface SavedState extends VersionedState {
    treeMode: TreeMode;
    showFactoryCode: boolean;
    showInternals: boolean;
    theme: Theme;
}
export interface LocalStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare class StateSaver {
    private readonly localStorage;
    static _stateKey: string;
    private _cachedState;
    constructor(localStorage?: LocalStorage);
    private get defaultState();
    get(): SavedState;
    set(sessionState: SavedState): void;
    private verifyData;
}
