


import { KEYS } from '../constants';
import { EditorAPI } from '../core';
import React from '../lib';
import { TSX } from '../lib/types';
import { createSourceFile, getCompilerApi } from '../tree/compiler';
import { treeSampler } from '../tree/treeSampler';
import { callTsApi } from './callTsApi';
import { checkIframeContent } from './checkContent';



/// EXAMPLE:


//describe('Тестирование наличия элементов внутри элемента counter', () => {
//  it('должен содержать поле ввода .counter__input', () => {   
//const counterInput = dom.querySelector('button');
// expect(counterInput).toExist()
//   }); 
//  it('должен содержать поле ввода .counter__increase', () => {
//     const counterIncrease = dom.querySelector('.counter');
//     expect(counterIncrease).toExist()
//      });
//       it('должен содержать поле ввода .counter__decrease', () => {
//       const counterDecrease = dom.querySelector('.counter');
//       expect(counterDecrease)
//       expect(counterDecrease).toExist()
//
//});});


interface IframeTestProps{
  editor: EditorAPI, 
  consoleRef: TSX.RefObj<HTMLDivElement>
} 

const TEST_CASES = {}
let scopeSuite = null;
let testCase = null;



function describe (testSuiteName: string, testCb: () => void) {

  TEST_CASES[testSuiteName] = {}
  scopeSuite = testSuiteName;
  testCb(); 
}

const it = (testCaseName: string, testCb: () => void) => {
  if (!scopeSuite) return;
  testCase = testCaseName
  TEST_CASES[scopeSuite][testCaseName] = {};
  testCb(); 
}

const expect = (el) => {
  if (!scopeSuite || !testCase) return;
  TEST_CASES[scopeSuite][testCase] = {}
  const testSlot = TEST_CASES[scopeSuite][testCase]

  testSlot.received = (el)
  

  return {
    toEqual: (expected:string) => { 
      if (!expected) return;
      testSlot.expected = expected
      testSlot.result = el == expected
     },
     toNotEqual: (expected:string) => {
      if (!expected) return;
      testSlot.expected = expected
      testSlot.result = el !== expected
    },
    toInclude: (expected:string) => {
      if (!expected) return;
      testSlot.expected = expected
      testSlot.result = (typeof el === "string" || Array.isArray(el)) && el?.includes(expected) 
    },
    toNotInclude: (expected:string) => {
      if (!expected) return;
      testSlot.expected = expected
      testSlot.result = !((typeof el === "string" || Array.isArray(el)) && el?.includes(expected) )
    },
    toExist: () => {
      testSlot.expected = el
      testSlot.result = !!el
    },
    toNotExist: () => {
      testSlot.expected = null
      testSlot.result = !el
    },
    toHaveText: (expected:string) => {
      if (!expected) return;
      testSlot.expected = expected
      const str = JSON.stringify(el)
      testSlot.result = str.includes(expected)
    },
    toNotHaveText: (expected:string) => {
      if (!expected) return;
      testSlot.expected = expected
      const str = JSON.stringify(el)
      testSlot.result = !str.includes(expected)
    },
  }
}



const runApiTest = async () => {
  const iframeWrap = window.top.document.querySelector('iframe#sandbox') as HTMLIFrameElement
  const dom = iframeWrap.contentDocument || iframeWrap.contentWindow.document;
  const mochaContent = 
  //localStorage.getItem(KEYS.__LS_MOCHA__)
`describe('Тестирование наличия элементов внутри элемента counter', () => {
  it('должен содержать поле ввода .counter__input', () => {   
const counterInput = dom.querySelector('button');
 expect(counterInput).toExist()
   }); 
  it('должен содержать поле ввода .counter__increase', () => {
     const counterIncrease = dom.querySelector('.counter');
     expect(counterIncrease).toExist()
      });
       it('должен содержать поле ввода .counter__decrease', () => {
       const counterDecrease = dom.querySelector('.counter');
       expect(counterDecrease)
       expect(counterDecrease).toExist()

});});`

  eval(mochaContent)
  console.log("Mocha result: " ,TEST_CASES)
}





const IframeTest = ({ consoleRef }:IframeTestProps) => {
  
  const handleTestRun = async () => {








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

  
    await runApiTest();

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