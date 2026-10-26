import BrandForm from "./BrandForm";
import BrandList from "./BrandList";
import GeneratePanel from "./GeneratePanel";
import Profile from "./Profile";
import { useState, useEffect } from 'react'
import './App.css'

const STEPS = [
  { num: "01 — Profile", title: "Describe your brand", text: "Add its industry, audience, voice and products once. BrandGPT keeps them on file." },
  { num: "02 — Generate", title: "Ask for what you need", text: "Request a caption, ad or email. Every request is written from your saved profile." },
  { num: "03 — History", title: "Reuse what works", text: "Every result is saved per brand, so you can copy and reuse it any time." },
]

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [brands, setBrands] = useState([])
  const [editingBrand, setEditingBrand] = useState(null)
  const [activeId, setActiveId] = useState(null)

  const isOnline = backendStatus === 'BrandGPT backend is running'

  // The active brand: the one the user picked, or the first if none (or it was deleted)
  const currentId = brands.some((b) => String(b.id) === String(activeId))
    ? activeId
    : brands[0]?.id

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
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete "${brand.name}"? This cannot be undone.`)) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/brands/${brand.id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Delete failed')

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
      .then((data) => setBackendStatus(data.message))
      .catch((error) => {
        setBackendStatus('Backend not reachable')
        console.error('Error:', error)
      })

    loadBrands()
  }, [])

  // Scroll reveal: fade sections in the first time they enter the viewport
  useEffect(() => {
    document.documentElement.classList.add('reveal-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="logo" href="#top">BrandGPT</a>
          <nav className="nav-links">
            <a href="#how">How it works</a>
            <a href="#workspace">Workspace</a>
            <a href="#about">About</a>
          </nav>
          <div className="nav-end">
            <span className={`status ${isOnline ? 'ok' : ''}`}>
              {isOnline ? 'Backend connected' : backendStatus}
            </span>
            <a className="btn btn-primary btn-sm" href="#workspace">Get started</a>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">AI marketing assistant</p>
            <h1>On-brand copy<br />every time</h1>
            <p className="lead">
              Save your brand profile once. BrandGPT writes captions, ads and emails
              that match your voice, audience and products.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#workspace">Add your first brand</a>
              <a className="link" href="#how">See how it works</a>
            </div>
          </div>

          <figure className="hero-art" aria-hidden="true">
            <svg viewBox="0 0 640 260" preserveAspectRatio="none">
              <path d="M0 90 C120 40 220 120 340 80 C460 40 560 20 640 0 V260 H0Z" fill="#d3d2e4" />
              <path d="M0 130 C120 90 230 150 340 120 C450 90 560 70 640 40 V260 H0Z" fill="#98a0dc" />
              <path d="M0 175 C130 150 240 190 350 160 C460 130 560 110 640 80 V260 H0Z" fill="#1d2fd0" />
              <path d="M0 175 C130 150 240 190 350 160 C460 130 560 110 640 80" fill="none" stroke="#fff" strokeWidth="2.5" />
            </svg>
            <figcaption>Fig. 01 — Brand voice, applied</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow">How it works</p>
            <h2 className="title">Three steps to<br />on-brand copy</h2>
          </div>
          <div className="steps">
            {STEPS.map((step) => (
              <div key={step.num} className="step reveal">
                <div className="shape" />
                <p className="num">{step.num}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="workspace">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow">Workspace</p>
            <h2 className="title">Your brands<br />and content</h2>
          </div>
          <div className="layout reveal">
            <div className="col">
              <GeneratePanel brands={brands} activeId={currentId} onSelect={setActiveId} />
            </div>
            <div className="col">
              <BrandForm
                onSaved={loadBrands}
                editingBrand={editingBrand}
                onCancelEdit={() => setEditingBrand(null)}
              />
              <BrandList
                brands={brands}
                activeId={currentId}
                onSelect={setActiveId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrap">
          <Profile />
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <span className="logo">BrandGPT</span>
          <p>Built with React, Flask and SQLite.</p>
        </div>
      </footer>
    </>
  )
}

export default App