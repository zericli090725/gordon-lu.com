import { useState } from 'react'
import gordonLogo from './assets/icon.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a  target="_blank">
          <img src={gordonLogo} className="logo" alt="Gordon logo" />
        </a>
        <a  target="_blank">
          <img src={gordonLogo} className="logo react" alt="Gordon logo" />
        </a>
      </div>
      <h1>Gordon Lu</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Gordon Lu's personal website
      </p>
    </>
  )
}

export default App
