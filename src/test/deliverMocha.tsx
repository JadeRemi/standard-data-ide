


import { KEYS } from '../constants';
import { EditorAPI } from '../core';
import React from '../lib';
import { TSX } from '../lib/types';
import { createSourceFile, getCompilerApi } from '../tree/compiler';
import { treeSampler } from '../tree/treeSampler';
import { TreeViewer } from '../tree/TreeViewer';
import { checkIframeContent } from './checkContent';
import * as ts from "typescript";

interface IframeTestProps{
  editor: EditorAPI, 
  consoleRef: TSX.RefObj<HTMLDivElement>
} 

const IframeTest = ({ consoleRef}:IframeTestProps) => {

  
  

  const handleTestRun = async () => {
    const iframe = document.querySelector('iframe');
    const iframeDoc = iframe?.contentDocument;
    const pTag = iframeDoc?.querySelector('p');

    const testResult = checkIframeContent(
      {
        pathArray: ["p"],
        expected: "123",
        node: pTag
      }
    )

   
    const editor: EditorAPI = window["api_editor"];

    const prepareCompiler = async () => {
      const code = editor.getValue("typescript")
  const compilerApi = await getCompilerApi("typescript")
      const sourceFile = createSourceFile(
        compilerApi,  
        code,       
        2,
        3 
    );

 const typedTree = treeSampler({
      api:compilerApi,
      sourceFile: sourceFile.sourceFile as any,
      selectedNode: sourceFile.sourceFile as any,
      onSelectNode: () => {},
      mode: 0,
   
    })
    
    console.log("FULL AST TREE", typedTree)
  }
  prepareCompiler();

    const js = localStorage.getItem(KEYS.__LS_JS__);
    const html = localStorage.getItem(KEYS.__LS_HTML__);
    const css = localStorage.getItem(KEYS.__LS_CSS__);
    const typescript = localStorage.getItem(KEYS.__LS_TS__);
    const json = localStorage.getItem(KEYS.__LS_JSON__);
    const consoleContent = consoleRef.current?.innerHTML


    console.log("Test results:", testResult, {
      js, html, css, typescript, json, consoleContent
    })
  };

 

  return (

        <button
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 100,
            backgroundColor: "green",
            padding: "16px", cursor: "pointer"
          }}
          onclick={handleTestRun}
        >
          Run Test
        </button>

  );
};

export default IframeTest;