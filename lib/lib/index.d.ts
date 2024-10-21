import { TLazyComponent, TProps, TSuspense, TUseRef } from "./types";
export default function TSX(type: any, props: any): any;
declare function Suspense(_a: TSuspense): Node;
declare function lazy(lazyComponent: TLazyComponent): (props: TProps) => Promise<Node>;
declare function render(component: Node, container: HTMLElement): void;
declare function microtask(task: MutationCallback): void;
declare function useEffect(effect: Function): void;
declare const useRef: TUseRef;
export { TSX, useRef, useEffect, microtask, lazy, render, Suspense };
export type {};
export interface InjectContent {
    injectHead?: string;
    injectBody?: string;
}
export declare const templateContent: (title?: string, { injectHead, injectBody }?: InjectContent) => string;
