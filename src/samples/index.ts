import data_json from "./stringified/data.json"
import index_html from "./stringified/index.html"
import main_js from "./stringified/main.js"
import main_tsx from "./stringified/main.tsx"
import script_js from "./stringified/script.js"
import style_css from "./stringified/style.css"

interface Defaults {
  javascript: string
  typescript: string
  css: string
  html: string
  json: string
}

const base = ''

const samples = [
  "/samples/main.tsx",
  "/samples/main.js",
  "/samples/style.css",
  "/samples/index.html",
  "/samples/data.json"
]

const stringifiedSamples = [
  main_tsx,
  main_js,
  style_css,
  index_html,
  data_json,
]

export const loadSamples = async (): Promise<Defaults> => {
  const [typescript, javascript, css, html, json] = stringifiedSamples
  //await Promise.all(
      //.map(sample => 
      //fetch(base + sample).then(res => res.text())
  //)

  return {
    typescript,
    javascript,
    css,
    html,
    json
  }
}

export const settings = {
  script: "/samples/script.js"
}



export const loadScript = () => script_js
  //fetch(base + settings.script).then(res => res.text())
