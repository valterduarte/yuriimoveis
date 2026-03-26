import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-2xl font-black uppercase text-[#1a1a1a]">Algo deu errado</h1>
          <p className="text-gray-500 text-sm max-w-sm">
            Ocorreu um erro inesperado. Tente recarregar a página ou volte para o início.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="btn-primary py-3 px-6 text-xs uppercase tracking-widest"
            >
              Recarregar
            </button>
            <Link to="/" className="py-3 px-6 text-xs uppercase tracking-widest border border-gray-300 hover:border-[#af1e23] hover:text-[#af1e23] transition-colors">
              Ir para o início
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
