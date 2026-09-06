import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // This will hold whatever Flask sends back
  const [backendStatus, setBackendStatus] = useState('Checking...')

  // useEffect with an empty array [] means:
  // "run this once, right when the component first appears on screen"
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((response) => response.json()) // parse the JSON response
      .then((data) => {
        setBackendStatus(data.message) // save it into state
      })
      .catch((error) => {
        setBackendStatus('Could not connect to backend')
        console.error('Error:', error)
      })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>BrandGPT</h1>
      <p>Backend status: <strong>{backendStatus}</strong></p>
    </div>
  )
}

export default App