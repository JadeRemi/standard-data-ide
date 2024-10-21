import './style.css';
import { JSX, TSX } from '../../../src/lib/types';

export interface Aside {
    onResize: (event: MouseEvent) => string;
    onDownload(): void;
    onRun(): void;
    sandboxRef: TSX.RefObj<HTMLIFrameElement>;
    ref: TSX.RefObj<HTMLDivElement>;
}
export declare const Aside: ({ ref, sandboxRef, onResize, onDownload, onRun, }: Aside) => JSX.Element;
