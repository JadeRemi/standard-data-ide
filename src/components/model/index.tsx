import './style.css'

import { render } from '../../lib'
import { JSX } from '../../lib/types'

type ModelAPI = { close: Function }

export const openModel = (message: (api: ModelAPI) => JSX.Element) => {
  const container = document.createElement("div")
  document.body.append(container)
  container.className = "Model"

  const close = () => {
    document.body.removeChild(container)
  }

  const api = { close }


  render(message(api), container)
  return api
}
