import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import Home from './pages/Home'

const Imoveis = lazy(() => import('./pages/Imoveis'))
const ImovelDetalhe = lazy(() => import('./pages/ImovelDetalhe'))
const Contato = lazy(() => import('./pages/Contato'))
const Admin = lazy(() => import('./pages/Admin'))

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    let raf
    function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
  return null
}

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname, location.search])
  return null
}

function ScrollReveal() {
  const location = useLocation()
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el))
    }
    const timer = setTimeout(observe, 80)
    const mutObs = new MutationObserver(observe)
    mutObs.observe(document.body, { childList: true, subtree: true })
    return () => {
      clearTimeout(timer)
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [location.pathname])
  return null
}

function App() {
  return (
    <Router>
      <SmoothScroll />
      <ScrollToTop />
      <ScrollReveal />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#af1e23]" /></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/imoveis/:id" element={<ImovelDetalhe />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </Router>
  )
}

export default App
