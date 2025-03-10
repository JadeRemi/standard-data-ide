

declare const LOADING: { init(): void; destroy(): void }

import './app.css'

import React, { render, useEffect, useRef } from './lib'

import {
  Aside,
  shouldAutoRun,
} from './components'
import { EMPTY_FILE, KEYS } from './constants'
import {
  addExtraLib,
  addModuleDeclaration,
  compileTS,
  createDiffEditor,
  createEditor,
  DiffEditorAPI,
  EditorAPI,
  monaco,
  updateCompilerOptions,
} from './core'
import { loadSamples, loadScript } from './samples'
import { makeSandCode } from './sandbox'
import { addUploadListener, debounce, initKeyBoard } from './utils'

const FILES = {
  current: "typescript",
  javascript: "main.js",
  typescript: "main.tsx",
  json: "data.json",
  css: "style.css",
  html: "index.html"
}

let jsFileName = localStorage.getItem(KEYS.__LS_JS_NAME__) || "JS"
let tsFileName = localStorage.getItem(KEYS.__LS_TS_NAME__) || "TS"
let jsonFileName = localStorage.getItem(KEYS.__LS_JSON_NAME__) || "JSON"
let cssFileName = localStorage.getItem(KEYS.__LS_CSS_NAME__) || "CSS"
let htmlFileName = localStorage.getItem(KEYS.__LS_HTML_NAME__) || "HTML"


const App = () => {
  let editor: EditorAPI
  let docWidth = document.documentElement.clientWidth
  const ref = useRef<HTMLDivElement>()
  const diff_ref = useRef<HTMLDivElement>()
  const sec_ref = useRef<HTMLDivElement>()
  const output_ref = useRef<HTMLIFrameElement>()
  const _theme = localStorage.getItem(KEYS.__LS_EDITOR_THEME__) as any

  const toolBar_ref = useRef<HTMLDivElement>()
  let toolBtns: HTMLButtonElement[]

  //localStorage.setItem(KEYS.__LS_JS_NAME__, "JS")
  //localStorage.setItem(KEYS.__LS_TS_NAME__, "TS")
  //localStorage.setItem(KEYS.__LS_JSON_NAME__, "JSON")
  //localStorage.setItem(KEYS.__LS_CSS_NAME__, "CSS")
  //localStorage.setItem(KEYS.__LS_HTML_NAME__, "HTML")



  //const jsFileName = useRef<string>(localStorage.getItem(KEYS.__LS_JS_NAME__) || "JS")
  //const tsFileName = useRef<string>(localStorage.getItem(KEYS.__LS_TS_NAME__) || "TS")
  //const jsonFileName = useRef<string>(localStorage.getItem(KEYS.__LS_JSON_NAME__) || "JSON")
  //const cssFileName = useRef<string>(localStorage.getItem(KEYS.__LS_CSS_NAME__) || "CSS")
  //const htmlFileName = useRef<string>(localStorage.getItem(KEYS.__LS_HTML_NAME__) || "HTML")


  //console.log("tsFileName", tsFileName.current)

  const reloadEditorContent = () => {
    const htmlText = localStorage.getItem(KEYS.__LS_HTML__);
    const cssText = localStorage.getItem(KEYS.__LS_CSS__);
    const jsText = localStorage.getItem(KEYS.__LS_JS__);
    const tsText = localStorage.getItem(KEYS.__LS_TS__);
    const jsonText = localStorage.getItem(KEYS.__LS_JSON__);
    editor.setValue("typescript", tsText)
    editor.setValue("javascript", jsText)
    editor.setValue("css", cssText)
    editor.setValue("html", htmlText)
    editor.setValue("json", jsonText)

    //console.log(localStorage.getItem(KEYS.__LS_TS_NAME__))

    jsFileName = localStorage.getItem(KEYS.__LS_JS_NAME__)
    tsFileName  = localStorage.getItem(KEYS.__LS_TS_NAME__)
    jsonFileName  = localStorage.getItem(KEYS.__LS_JSON_NAME__)
    cssFileName  = localStorage.getItem(KEYS.__LS_CSS_NAME__)
    htmlFileName  = localStorage.getItem(KEYS.__LS_HTML_NAME__)
    

    window.location.reload()
    
  }

  const init = async () => {
    let defaults = {
      typescript: localStorage.getItem(KEYS.__LS_TS__),
      javascript: localStorage.getItem(KEYS.__LS_JS__),
      css: localStorage.getItem(KEYS.__LS_CSS__),
      html: localStorage.getItem(KEYS.__LS_HTML__),
      json: localStorage.getItem(KEYS.__LS_JSON__)
    }
    if (Object.keys(defaults).every(k => !defaults[k])) {
      defaults = await loadSamples()
    }

    editor = createEditor(ref.current, defaults)
    window["api_editor"] = editor.getInstance()


    toolBtns = Array.from(toolBar_ref.current.children) as any

    const _width = localStorage.getItem(KEYS.__LS_EDITOR_WIDTH__)
    _theme && setTheme(_theme)
    _width && setEditorSize(Number(_width))

    const bgImage = localStorage.getItem(KEYS.__LS_BG__)
    if (bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`
    }
    const bgOp = localStorage.getItem(KEYS.__LS_BG_OP__)
    if (bgOp && bgImage) {
      document.body.style.opacity = String(Number(bgOp) / 100)
    } else {
      document.body.style.opacity = "1"
    }

    // init current tab
    const tabIndex = Number(localStorage.getItem(KEYS.__LS_CUR_TAB__) || "4")
    activeBtn(tabIndex)



    // listeners
    addUploadListener(({ name, type, content }) => {
      if (type === "text/html") {
        FILES.html = name
        editor.setValue("html", content)
        activeBtn(1)
      } else if (type === "text/css") {
        FILES.css = name
        editor.setValue("css", content)
        activeBtn(2)
      } else if (type === "text/javascript") {
        FILES.javascript = name
        editor.setValue("javascript", content)
        activeBtn(3)
      } else if (name.endsWith(".d.ts")) {
        addExtraLib(content)
      } else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
        FILES.typescript = name
        editor.setValue("typescript", content)
        activeBtn(4)
      } else if (name.endsWith(".json")) {
        FILES.json = name
        editor.setValue("json", content)
        activeBtn(5)
      }
      run()
    })

    initKeyBoard({
      onSave() {
        run()
      }
    })

    window["monaco"] = monaco
    window["api_compileTS"] = async () => {
      const result = await compileTS(editor.getModel("typescript").uri)
      return result
    }
    window["api_makeSandCode"] = (mode: "dev" | "pro" = "dev") =>
      makeSandCode(editor, mode)
    window["api_addModuleDeclaration"] = addModuleDeclaration
    window["api_updateCompilerOptions"] = updateCompilerOptions


    window.addEventListener("resize", () =>
      debounce(() => {
        docWidth = document.documentElement.clientWidth
      })
    )

    let script = localStorage.getItem(KEYS.__LS_ARG__)
    if (!script) {
      script = await loadScript()
      localStorage.setItem(KEYS.__LS_ARG__, script)
    }


    LOADING.destroy()

    eval(script)

    run()
  }

  useEffect(()=> {
    init()
  })

  const run = async () => {
    output_ref.current.srcdoc = "[TS]: Compiling..."
    const code = await makeSandCode(editor, "dev")
    output_ref.current.srcdoc = code
  }

  const activeBtn = (target: number) => {
    for (const btn of toolBtns) {
      if (btn.tagName === "BUTTON") {
        btn.className = "ButtonHigh"
      }
    }
    toolBtns[target]["className"] = "ButtonHigh ButtonHigh-Active"

    let type = null
    if (target === 1) {
      type = "html"
    } else if (target === 2) {
      type = "css"
    } else if (target === 3) {
      type = "javascript"
    } else if (target === 4) {
      type = "typescript"
    } else if (target === 5) {
      type = "json"
    }

    if (type) {
      editor.changeModel(type)
      FILES.current = type
      localStorage.setItem(KEYS.__LS_CUR_TAB__, String(target))
    }
  }

  const changeAllBtnsDisabled = (disabled = true) => {
    toolBtns[1]["disabled"] = disabled
    toolBtns[2]["disabled"] = disabled
    toolBtns[3]["disabled"] = disabled
    toolBtns[4]["disabled"] = disabled
    toolBtns[5]["disabled"] = disabled
  }

  const setTheme = (theme: "vs" | "vs-dark" | "hc-black") => {
    monaco.editor.setTheme(theme)
    localStorage.setItem(KEYS.__LS_EDITOR_THEME__, theme)
    if (theme === "vs") {
      document.body.style.backgroundColor = "white"
    } else {
      document.body.style.backgroundColor = "black"
    }
  }

  const aside_ref = useRef<HTMLDivElement>()

  const setEditorSize = (width: number) => {
    const height = editor.getSize().height
    sec_ref.current.style.width = width + "px"
    editor.setSize(width, height)
    const asideWidth = docWidth - width
    if (diffEditor) {
      diffEditor.setSize(width, height)
      aside_ref.current.style.width = asideWidth + "px"
    }
    return `${asideWidth} x ${height}`
  }

  const dl_ref = useRef<HTMLAnchorElement>()

  async function download(type: "file" | "index" = "file") {
    const aLink = dl_ref.current
    let fileName: string
    let content: string

    if (type === "file") {
      if (FILES.current === "javascript") {
        fileName = FILES.javascript
        content = editor.getValue("javascript")
      } else if (FILES.current === "css") {
        fileName = FILES.css
        content = editor.getValue("css")
      } else if (FILES.current === "html") {
        fileName = FILES.html
        content = editor.getValue("html")
      } else if (FILES.current === "typescript") {
        fileName = FILES.typescript
        content = editor.getValue("typescript")
      } else if (FILES.current === "json") {
        fileName = FILES.json
        content = editor.getValue("json")
      }
    }

    if (type === "index") {
      fileName = "index.html"
      content = await makeSandCode(editor, "pro")
    }

    const blob = new Blob([content])
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
  }

  // diff
  let diffEditor: DiffEditorAPI = null

  const openDiffEditor = () => {
    diffEditor = createDiffEditor(diff_ref.current, "", "", FILES.current)
    window["api_diffEditor"] = diffEditor.instance
    const { width, height } = editor.getSize()
    diffEditor.setSize(width, height)
  }

  const closeDiffEditor = () => {
    if (diffEditor) {
      diffEditor.instance.dispose()
      diffEditor = null
      window["api_diffEditor"] = null
    }
  }

  const switchDiff = () => {
    if (diffEditor) {
      // close diff
      closeDiffEditor()
      diff_ref.current.style.display = "none"
      ref.current.style.display = "block"
      changeAllBtnsDisabled(false)

      // restore state when load.
      const state = editor.getState(FILES.current)
      const instance = editor.getInstance()
      instance.restoreViewState(state)
      instance.focus()
    } else {
      ref.current.style.display = "none"
      diff_ref.current.style.display = "block"
      changeAllBtnsDisabled(true)
      openDiffEditor()

      const instance = editor.getInstance()
      const state = instance.saveViewState()
      editor.setState(FILES.current, state)

      const value = editor.getValue()
      if (diffEditor) {
        diffEditor.modifiedModel.setValue(value)
        diffEditor.originalModel.setValue(value)
      }
    }
  }

  const saveModified = () => {
    if (diffEditor) {
      const value = diffEditor.instance.getModifiedEditor().getValue()
      editor.setValue(value)
      run()
    }
  }

  const showNav = false




//  <button
//  className="ButtonHigh"
//  onclick={() => openModel(({ close }) => <Settings close={close} />)}
//>
//  Profile
//</button>

//  <button
//  className="ButtonHigh"
//  style={{ float: "right" }}
//  onclick={() => download("file")}
//>
//  Download
//</button>

//<button
//className="ButtonHigh"
//onclick={() => openModel(ModuleManager)}
//>
//Lib
//</button>
//<button className="ButtonHigh" onclick={switchDiff}>
//Diff
//</button>


  return (
    <div className="App">
      <section ref={sec_ref} className="Main">
        <nav ref={toolBar_ref} className="ToolBar">
          <div
            style={{
              borderBottom: "1px solid #80808085",
              width: "0.5rem"
            }}
          />
          {htmlFileName!==EMPTY_FILE ? <button className="ButtonHigh" onclick={() => activeBtn(1)}>
            {htmlFileName}
          </button> : ""}
          {cssFileName!==EMPTY_FILE ? <button className="ButtonHigh" onclick={() => activeBtn(2)}>
            {cssFileName}
          </button>
          : ""}
          {jsFileName!==EMPTY_FILE ? <button className="ButtonHigh" onclick={() => activeBtn(3)}>
            {jsFileName}
          </button>
          : ""}
          {tsFileName!==EMPTY_FILE ? <button
            className="ButtonHigh ButtonHigh-Active"
            onclick={() => activeBtn(4)}
          >
            {tsFileName}
          </button>
          : ""}
          { jsonFileName!==EMPTY_FILE ? <button
            className="ButtonHigh"
            title="var __VAR_JSON__"
            onclick={() => activeBtn(5)}
          >
            {jsonFileName}
          </button>
          : ""}
          <div
            style={{
              flexGrow: "1",
              borderBottom: "1px solid #80808085"
            }}
          />
      
    
          <select
            className="ButtonHigh"
            oninput={e => setTheme(e.target["value"])}
          >
            <option selected={_theme === "vs"} value="vs">
              Light
            </option>
            <option selected={_theme === "vs-dark"} value="vs-dark">
              Dark
            </option>
            <option selected={_theme === "hc-black"} value="hc-black">
              Black
            </option>
          </select>
    
  

          
       
        </nav>
        <main
          className="Editor"
          ref={ref}
          onkeyup={() => shouldAutoRun() && debounce(run)}
        />
        <div
          className="DiffEditor"
          ref={diff_ref}
          onkeyup={() => shouldAutoRun() && debounce(saveModified)}
        />
      </section>
      <Aside
        ref={aside_ref}
        sandboxRef={output_ref}
        onRun={run}
        onResize={e => setEditorSize(e.clientX)}
        onDownload={() => download("index")}
        editor={editor}
        reload={reloadEditorContent}
        rerun={run}
      />
      <a ref={dl_ref} />
    </div>
  )
}

const rerender = () => {
  render(<App />, document.getElementById("root"))
}

rerender()




