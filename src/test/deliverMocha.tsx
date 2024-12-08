


import { KEYS } from '../constants';
import { EditorAPI } from '../core';
import React from '../lib';
import { TSX } from '../lib/types';
import { createSourceFile, getCompilerApi } from '../tree/compiler';
import { treeSampler } from '../tree/treeSampler';
import { callTsApi } from './callTsApi';
import { checkIframeContent } from './checkContent';
import { expect } from "chai"

interface IframeTestProps{
  editor: EditorAPI, 
  consoleRef: TSX.RefObj<HTMLDivElement>
} 

const describe = (testSuiteName: string, testCb: () => void) => {
     const b = testCb(); 
     console.log(testSuiteName)
}

const it = (testCaseName: string, testCb: () => void) => {
  const b = testCb(); 
  console.log(testCaseName)
}

//const expect = (a) => {console.log("expect", a)}
// toEqual
// toNotEqual




const IframeTest = ({ consoleRef}:IframeTestProps) => {
  
  console.log(expect)

  const handleTestRun = async () => {

    const a = "describe()"




    describe('Тестирование наличия элементов внутри элемента counter', () => {
         it('должен содержать поле ввода .counter__input', () => {   
      const counterInput = document.querySelector('.counter .counter__input');
        //chai.expect(counterInput).to.exist;
        expect(counterInput)
          }); 
         it('должен содержать поле ввода .counter__increase', () => {
            const counterIncrease = document.querySelector('.counter .counter__increase');
           //  chai.expect(counterIncrease).to.exist;
           expect(counterIncrease)
             });
              it('должен содержать поле ввода .counter__decrease', () => {
              const counterDecrease = document.querySelector('.counter .counter__decrease');
              expect(counterDecrease)
       //chai.expect(counterDecrease).to.exist;
       });});


     // Run the tests and collect results


   // "tests": 
   // "describe('Тестирование наличия элементов внутри элемента counter', () => {
   //  it('должен содержать поле ввода .counter__input', () => {   
   //   const counterInput = dom.querySelector('.counter .counter__input');
   //     chai.expect(counterInput).to.exist;  }); 
   //      it('должен содержать поле ввода .counter__increase', () => {
   //         const counterIncrease = dom.querySelector('.counter .counter__increase');
   //          chai.expect(counterIncrease).to.exist;
   //          });
   //           it('должен содержать поле ввода .counter__decrease', () => {
   //           const counterDecrease = dom.querySelector('.counter .counter__decrease');
   //           
   //    chai.expect(counterDecrease).to.exist; });});",

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

 const typedTree = await treeSampler({
      api:compilerApi,
      sourceFile: sourceFile.sourceFile as any,
      selectedNode: sourceFile.sourceFile as any,
      bindingTools: sourceFile.bindingTools,
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


    const tsApiResponse =     await callTsApi();

    console.warn("Ts API:", tsApiResponse)

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