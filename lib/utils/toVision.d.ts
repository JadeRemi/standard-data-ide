import type { JSX } from "../lib/types";
export type TJSXElement = JSX.Element & {
    type: any;
    props: any;
};
export type Element = {
    component: string;
    style?: string | {
        [key: string]: string | number;
    };
    children?: ElementList;
    type?: any;
    [key: string]: any;
};
export type ElementList = null | undefined | Element | Array<Element>;
export declare function toVisionElement(input: TJSXElement): Element;
