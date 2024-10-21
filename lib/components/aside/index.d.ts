import './style.css';
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
}
export declare const Aside: ({ ref, sandboxRef, onResize, onDownload, onRun, }: Aside) => any;
