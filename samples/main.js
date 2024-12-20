
const packages = __VAR_JSON__.dependencies
const oldLoad = requirejs.load
requirejs.load = function (context, id, url) {
  if (id in packages) {
    url = packages[id]
  }
  return oldLoad.call(requirejs, context, id, url)
}

if (top !== self) {
  if (!top._finished) {
    top.LOADING.init()
    const typescriptVersion = top.monaco.languages.typescript.typescriptVersion
    console.log(`[<span style="color:blue;">Typescript Version:${typescriptVersion}</span>]`)
   // console.log('--- wait for types fetching... ---')
    const info = m => `<span style="background:lightskyblue">${m}</span>`
    const types = __VAR_JSON__.types
    const names = Object.keys(types)
    const count = names.length
    let index = 0
    Promise.all(names.map(name => top.api_addModuleDeclaration(types[name], name.startsWith('global:') ? null : name)
      .then(() =>{})))
       // console.log(`type(${++index}/${count}): ${info(`[${name}]`)} fetched`))))
      .then(() => {
       // console.log(`--- types fetching finished. ---`)
        top.LOADING.destroy()
      })
    top._finished = true
  }
}


console.log(new Date().toLocaleString())
