import React from '../../../src/lib'
import react from "react";

export const Sandbox = (
    {sandboxRef}:{sandboxRef?: react.RefObj<HTMLIFrameElement>} = {}) => {
    return <iframe ref={sandboxRef} id="sandbox"/>
} 




