import React, { useState } from 'react'
import Header from "./Header.jsx"
import Input from "./Input.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Input/>
    </>
  )
}

export default App
