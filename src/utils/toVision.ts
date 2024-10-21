import * as React from "react";
import type {JSX} from "../lib/types" 

export type TJSXElement = JSX.Element & {
    type: any
    props: any
}

export type Element = {
    component: string;
    style?: string | { [key: string]: string | number };
    children?: ElementList;
    type?: any
    [key: string]: any;
  };

  export type ElementList = null | undefined | Element | Array<Element>;


type Json = {
    [key: string]: string | number | Array<Json> | Json;
  };

export function toVisionElement(input: TJSXElement) {
    let utils = {
      unwrapFunctionElement(functionType: Function): TJSXElement {
        let result: Function | TJSXElement = functionType();
        return typeof result === "function"
          ? this.unwrapFunctionElement(result)
          : result;
      },
  
      isElement(object: Json) {
        return typeof object === "object" && object.type && true;
      },
  
      getElementType(type: Function | TJSXElement | string): string {
        return typeof type === "function"
          ? this.getElementType(type())
          : typeof type === "object"
          ? type.type
          : type;
      }
    };
  
    let newObj: Element = { component: "" };
    let isRootElement = false;
  
    let element = input.type;
  
    if (typeof element === "function") {
      let unwrappedElement = utils.unwrapFunctionElement(element);
  
      let {
        props: { children, ...props }
      } = unwrappedElement;
  
      newObj.component = utils.getElementType(unwrappedElement.type);
      newObj.props = props;
  
      if (utils.isElement(children)) {
        newObj.children = toVisionElement(children);
      }
  
      if (Array.isArray(children)) {
        newObj.children = children.map(toVisionElement);
      }
    }
  
    if (typeof element === "string") {
      isRootElement = true;
    }
  
    if (isRootElement) {
      let {
        props: { children, ...props }
      } = input;
      newObj.component = input.type;
  
      if (utils.isElement(children)) {
        newObj.children = toVisionElement(children);
      }
  
      if (Array.isArray(children)) {
        newObj.children = children.map(toVisionElement);
      }
      newObj.props = props;
    }
  
    return newObj;
  }