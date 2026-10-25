import BrandForm from "./BrandForm";
import BrandList from "./BrandList";
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [brands, setBrands] = useState([])

  const loadBrands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brands')
      const data = await response.json()
      setBrands(data)
    } catch (error) {
      console.error('Could not load brands:', error)
    }
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.message)
      })
      .catch((error) => {
        setBackendStatus('Could not connect to backend')
        console.error('Error:', error)
      })

    loadBrands()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>BrandGPT</h1>
      <p>Backend status: <strong>{backendStatus}</strong></p>

      <BrandForm onCreated={loadBrands} />
      <BrandList brands={brands} />
    </div>
  )
}

export default App