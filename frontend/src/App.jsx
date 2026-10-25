import BrandForm from "./BrandForm";
import BrandList from "./BrandList";
import GeneratePanel from "./GeneratePanel";
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [brands, setBrands] = useState([])
  const [editingBrand, setEditingBrand] = useState(null)

  const loadBrands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brands')
      const data = await response.json()
      setBrands(data)
    } catch (error) {
      console.error('Could not load brands:', error)
    }
  }

  const handleEdit = (brand) => {
    setEditingBrand(brand)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete "${brand.name}"? This cannot be undone.`)) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/brands/${brand.id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Delete failed')

      // If we were editing the brand we just deleted, leave edit mode
      if (editingBrand && editingBrand.id === brand.id) setEditingBrand(null)
      loadBrands()
    } catch (error) {
      console.error('Could not delete brand:', error)
      alert('Could not delete the brand.')
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

      <BrandForm
        onSaved={loadBrands}
        editingBrand={editingBrand}
        onCancelEdit={() => setEditingBrand(null)}
      />
      <GeneratePanel brands={brands} />
      <BrandList brands={brands} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default App