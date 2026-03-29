import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import ErrorBoundary from './components/ErrorBoundary'
const Home = lazy(() => import('./pages/Home'))
const Imoveis = lazy(() => import('./pages/Imoveis'))
const ImovelDetalhe = lazy(() => import('./pages/ImovelDetalhe'))
const BairroPage = lazy(() => import('./pages/BairroPage'))
const Contato = lazy(() => import('./pages/Contato'))
const Admin = lazy(() => import('./pages/Admin'))

// Property slugs always end with -<number> (e.g. play-condominio-18)
// Bairro slugs never end with a number (e.g. jardim-roberto)
function ImovelRouter() {
  const { slug } = useParams()
  return /-\d+$/.test(slug) ? <ImovelDetalhe /> : <BairroPage key={slug} />
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
      return
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const observeNew = () =>
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el))

    const timer = setTimeout(observeNew, 80)

    // Re-observe when async content (e.g. API-loaded property cards) is added to the DOM.
    // Only fires on node additions (not attribute/text changes) to keep it cheap.
    let debounce
    const mutObs = new MutationObserver(mutations => {
      if (mutations.some(m => m.addedNodes.length > 0)) {
        clearTimeout(debounce)
        debounce = setTimeout(observeNew, 50)
      }
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      clearTimeout(debounce)
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [location.pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollReveal />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#af1e23]" /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/imoveis" element={<Imoveis />} />
                <Route path="/imoveis/:slug" element={<ImovelRouter />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </Router>
  )
}

export default App
