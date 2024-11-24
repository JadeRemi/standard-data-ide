import './style.css';
import { EditorAPI } from '../../core';
export interface Aside {
    onResize: (event: MouseEvent) => string;
    onDownload(): void;
    onRun(): void;
    sandboxRef: {
        current: HTMLIFrameElement;
    };
    ref: {
        current: HTMLDivElement;
    };
    editor: EditorAPI;
    reload: ({}: {}) => void;
    rerun: () => Promise<void>;
}
export declare const Aside: ({ ref, sandboxRef, onResize, onDownload, onRun, editor, reload, rerun }: Aside) => any;
