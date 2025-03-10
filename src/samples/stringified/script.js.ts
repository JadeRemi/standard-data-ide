
const script_js =`
const THEME_NAME = '__EDITOR_EDITOR_THEME__'
const themer = top.document.querySelector('.ToolBar select')
const hasTheme = theme => top.api_editor._themeService._knownThemes.has(theme)
const base = 'https://unpkg.com/monaco-themes@0.3.3/themes/'
if (themer.children.length === 3) {
  fetch(\`\${base}themelist.json\`).then(res => res.json()).then(themes => {
    const current = localStorage.getItem(THEME_NAME)
    const setTheme = themeName => {
      if (hasTheme(themeName)) {
        top.monaco.editor.setTheme(themeName)
        localStorage.setItem(THEME_NAME, themeName)
      } else {
        const themeFile = themes[themeName]
        if (themeFile) {
          fetch(\`\${base}\${themeFile}.json\`)
            .then(res => res.json())
            .then(themeData => {
              if (themeData.base === 'vs') {
                top.document.body.style.backgroundColor = 'white'
              }
              if (themeData.base === 'vs-dark') {
                top.document.body.style.backgroundColor = 'black'
              }
              top.monaco.editor.defineTheme(themeName, themeData)
              top.monaco.editor.setTheme(themeName)
              localStorage.setItem(THEME_NAME, themeName)
            })
        }
      }
    }
    setTheme(current)
    if (themer.children.length === 3) {
      const last = current ? \`<option value="\${current}">\${current}</option>\` : ''
      const themeOps = Object.keys(themes)
        .reduce((acc, theme) => theme === current ? acc : acc +=
          \`<option value="\${theme}">\${theme}</option>\`, last)
      themer.innerHTML = themeOps + themer.innerHTML
      themer.oninput = () => setTheme(themer.value)
    }
  })
}
  `

  export default script_js
