import './style.css'
import React, { useEffect, useRef } from '../../lib'
import { KEYS } from '../../constants'
import { addDragListener } from '../../utils'
import { Sandbox } from './Sandbox'
import IframeTest from '../../test/deliverMocha';
import { EditorAPI } from '../../core'
import { TestLoader } from '../../test/loadTests'
import { TreeViewer } from '../../tree/TreeViewer'
import { createSourceFile, getCompilerApi } from '../../tree/compiler'
import { CompileRunner } from '../../test/rerunCompile'

export interface Aside {
  onResize: (event: MouseEvent) => string
  onDownload(): void
  onRun(): void
  sandboxRef: { current : HTMLIFrameElement }
  ref: { current : HTMLDivElement }
  editor: EditorAPI
  reload: ({}) => void
  rerun: () => Promise<void>
}

export const Aside = ({
  ref,
  sandboxRef,
  onResize,
  onDownload,
  onRun,
  editor,
  reload,
  rerun
}: Aside) => {
  const asideSize_ref = useRef<HTMLDivElement>()
  const aside_console_ref = useRef<HTMLDivElement>()
  const console_ref = useRef<HTMLDivElement>()

 


  // console receive
  let consoleContent = ''
  const clearConsole = () => {
    consoleContent = ''
    console_ref.current.innerHTML = consoleContent
  }
  const console_style = `line-height:1.5rem;border-bottom: 1px solid #e8e8e8;`
  const renderConsole = () => {
    console_ref.current.innerHTML = consoleContent
    console_ref.current.scrollTo({
      top: console_ref.current.scrollHeight,
      behavior: 'smooth',
    })
  }
  const pushConsole = (data: { method: string; value: string }) => {
    if (data.method === KEYS.__MESSAGE_CONSOLE__) {
      consoleContent += `<pre style="${console_style}">${data.value}</pre>`
      renderConsole()
    }
    if (data.method === KEYS.__MESSAGE_CONSOLE_ERROR__) {
      consoleContent += `<pre style="${console_style}color: red;">${data.value}</pre>`
      renderConsole()
    }
  }



//  <button className="ButtonHigh" onclick={onRun}>
//  Run
//</button>
//<button className="ButtonHigh" onclick={() => onDownload()}>
//  Export
//</button>
//<button
//  className="ButtonHigh"
//  title="compile ts code to console"
//  onclick={() =>
//    window['api_compileTS']().then((result: string) =>
//      pushConsole({ method: KEYS.__MESSAGE_CONSOLE__, value: result })
//    )
//  }
//>
//  Parse
//</button>


  useEffect(() => {
    // init console height
    const _consHeight = localStorage.getItem(KEYS.__LS_EDITOR_CONS_HEIGHT__)
    if (_consHeight) {
      aside_console_ref.current.style.height = _consHeight
    }

    window.addEventListener('message', event => {
      pushConsole(event.data)
    })
  })

  return (
    <aside ref={ref} className="Aside">
      <div
        className="Aside-Btn"
        ref={el =>
          addDragListener(
            el,
            e => {
              asideSize_ref.current.textContent = onResize(e)
            },
            () => {
              sandboxRef.current.style.display = 'none'
              asideSize_ref.current.style.display = 'block'
              aside_console_ref.current.style.display = 'none'
            },
            e => {
              asideSize_ref.current.style.display = 'none'
              sandboxRef.current.style.display = 'block'
              aside_console_ref.current.style.display = 'block'
              localStorage.setItem(KEYS.__LS_EDITOR_WIDTH__, String(e.clientX))
            }
          )
        }
      />
      <div className="Aside-Run">
       
        <div style={{ flexGrow: '1' }} />

      </div>
      <Sandbox sandboxRef={sandboxRef}/>
      
      <IframeTest editor={editor} consoleRef={console_ref}/>
      <TestLoader reload={reload}/>
      <CompileRunner rerun={rerun} />
      
      <div className="Aside-Size" ref={asideSize_ref} />
      <div ref={aside_console_ref} className="Aside-Console">
        <div className="Console-Bar">
          <div style={{ flexGrow: '1' }}>Console</div>
          <div className="iconfont icon-clear" onclick={clearConsole} />
          <div
            className="Console-Btn"
            ref={el =>
              addDragListener(
                el,
                e => {
                  const clientY = e.clientY
                  if (clientY >= 21) {
                    const consHeight = `calc(100vh - ${e.clientY}px + 1.5rem)`
                    aside_console_ref.current.style.height = consHeight
                  }
                },
                () => {
                  sandboxRef.current.style.display = 'none'
                  asideSize_ref.current.style.display = 'block'
                },
                e => {
                  asideSize_ref.current.style.display = 'none'
                  sandboxRef.current.style.display = 'block'
                  let clientY = e.clientY
                  clientY = clientY > 21 ? clientY : 21
                  const consHeight = `calc(100vh - ${clientY}px + 1.5rem)`
                  localStorage.setItem(
                    KEYS.__LS_EDITOR_CONS_HEIGHT__,
                    consHeight
                  )
                }
              )
            }
          />
        </div>
        <div ref={console_ref} className="Console-Output" />
      </div>
    </aside>
  )
}
