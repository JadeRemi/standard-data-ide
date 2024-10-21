import react from "react";


class Container extends react.Component {
    private _child;

    constructor({child}) {
        super()
       this._child = child
    }

    render() {
      return  ;
    }
  }

export const castElement = (el: HTMLElement) => {
    const a = "div"
    const node: react.ReactNode = react.createElement(a, {
        ref:  ref => ref.appendChild(el) 
      }, "123456")
    return node
}