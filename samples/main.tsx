import ReactDOM from 'react-dom'
import React, { useState, useEffect, useRef } from 'react'

const mountNode = document.getElementById('root')

const App = () => {
  const [state, setState] = useState(0)
  const btn = useRef<HTMLButtonElement>()

  const sayHello = () => {
    console.log("Hello world")
  }

  useEffect(() => {
    sayHello()
  }, [])

  return <div>
    <div>
      <p>Browser IDE for Standard Data</p>
      click to add: {state}
      <div>
        <button ref={btn} onClick={() => {
          sayHello()
          setState(state + 1)
        }}>setState(state + 1)</button>
      </div>
    </div>
  </div>
}

ReactDOM.render(<App />,
  mountNode)
