export type TSuspense = {
    fallback: Node;
    children: Promise<Node>;
};

export type TProps = {
    ref: TSX.Ref<any>;
    style: CSSStyle;
};


export type TLazyComponent = (props: TProps) => Promise<{
    default: Node;
}>;

export type TUseRef = <T>(current?: T) => TSX.RefObj<T>

///

export declare function TSX(type: any, props: any, ...children: any[]): any;


export namespace JSX {
        export type IntrinsicElements = {
            [K in keyof HTMLElementTagNameMap]: TSX.IntrinsicAttributes<K>
        };
        export interface Element extends  HTMLElement {};
        export interface ElementChildrenAttribute {
            children: {};
        }
        export import Ref = TSX.Ref;
    }



export namespace TSX {
    export type RefCallback<T> = (instance: T) => void;
    export type RefObj<T> = {
        current: T;
    };
    export type Ref<T> = RefObj<T> | RefCallback<T>;
    export type TSXAttributes<T> = {
        ref: Ref<T>
        children: any;
    }
    type Attributes<K extends keyof HTMLElementTagNameMap> = Override<HTMLElementTagNameMap[K], "style", CSSStyle> & TSXAttributes<HTMLElementTagNameMap[K]>;
    export type IntrinsicAttributes<K extends keyof HTMLElementTagNameMap> = Partial<Attributes<K>>;
}
export  type CSSStyle = Partial<CSSStyleDeclaration>;
export  type Override<T, K extends keyof T, V> = {
    [P in keyof T]: P extends K ? V : T[P];
};

