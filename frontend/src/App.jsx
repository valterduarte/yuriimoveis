import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import Home from './pages/Home'
import Imoveis from './pages/Imoveis'
import ImovelDetalhe from './pages/ImovelDetalhe'
import Contato from './pages/Contato'

function ScrollReveal() {
  const location = useLocation()
  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
        { threshold: 0.12 }
      )
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 80)
    return () => clearTimeout(timer)
  }, [location.pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollReveal />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/imoveis" element={<Imoveis />} />
            <Route path="/imoveis/:id" element={<ImovelDetalhe />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </Router>
  )
}

export default App
