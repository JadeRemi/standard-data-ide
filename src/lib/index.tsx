import { TLazyComponent, TProps, TSuspense, TUseRef } from "./types"

"use strict";
const __assign =  Object.assign 
//|| function(t) {
//        for (var s, i = 1, n = arguments.length; i < n; i++) {
//            s = arguments[i];
//            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
//                t[p] = s[p];
//        }
//        return t;
//    };
//    return __assign.apply(this, arguments);
//}

Object.defineProperty(exports, "__esModule", { value: true });

var flat1 = function (arr) { return [].concat.apply([], arr); };
var flat2 = function (arr) { return flat1(flat1(arr)); };
var has = function (array, item) { return array.includes(item); };
var resolve = function (props) {
    return Object.entries(props).reduce(function (props, _a) {
        var k = _a[0], v = _a[1];
        // skip tsx prop: ref, style
        if (!has(["ref", "style"], k)) {
            // class, classname -> className
            var className = has(["class", "classname"], k) ? "className" : k;
            props[className] = v;
        }
        return props;
    }, {});
};
var flatList = function (children) {
    return flat2(children).filter(function (ch) {
        return typeof ch === "string" ? ch.replace(/ |\r?\n|\r/g, "") : 1;
    });
};
var renderDOM = function (vnode) {
    var type = vnode.type, props = vnode.props, children = vnode.children;
    var dom = document.createElement(type);
    if (props) {
        Object.assign(dom, resolve(props));
        if (props.style)
            Object.assign(dom["style"], props.style);
        if (props.ref) {
            if (typeof props.ref === "function") {
                props.ref(dom);
            }
            else {
                props.ref.current = dom;
            }
        }
    }
    dom.append.apply(dom, children);
    return dom;
};
export default function TSX(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    children = flatList(children);
    if (typeof type === "function") {
        return type(__assign(__assign({}, props), { children: children[1] ? children : children[0] }));
    }
    else {
        return renderDOM({ type: type, props: props, children: children });
    }
}

function Suspense(_a: TSuspense): Node {
    var fallback = _a.fallback, children = _a.children;
    children.then(function (dom) {
        var container = fallback.parentNode;
        container.replaceChild(dom, fallback);
    });
    return fallback;
};
function lazy(lazyComponent: TLazyComponent) : (props: TProps) => Promise<Node>{ return function (props) {
    return lazyComponent(props).then(function (component) { return component.default; });
}; };

function render(component: Node, container: HTMLElement): void {
    container.innerHTML = "";
    container.append(component);
};

function microtask(task: MutationCallback): void {
    var observer = new MutationObserver(task);
    var element = document.createTextNode("");
    observer.observe(element, { characterData: true });
    element.data = "";
}
function useEffect(effect: Function): void {
    microtask(function () { return effect(); });
}

const  useRef: TUseRef = (current) => {
    if (current === void 0) { current = null; }
    return { current: current };
}

export {
    TSX, useRef, useEffect, microtask, lazy, render, Suspense
}

export type {}

// webpack 

export interface InjectContent {
    injectHead?: string;
    injectBody?: string;
  }
  export declare const templateContent: (title?: string, { injectHead, injectBody }?: InjectContent) => string;
  