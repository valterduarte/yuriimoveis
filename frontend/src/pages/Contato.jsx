import { useState } from 'react'
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
  const [status, setStatus] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      await axios.post(`${API_URL}/api/contato`, form)
      setStatus('success')
      setForm({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">

      {/* Hero */}
      <section className="py-24 bg-dark text-white">
        <div className="container mx-auto px-6">
          <span className="section-label">Fale Conosco</span>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none">Contato</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info */}
            <div className="space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Informações</h2>

              {[
                { icon: FiMapPin, title: 'Endereço', content: 'Rua Canela das Araucárias, 123\nCentro, Canela - RS\nCEP: 95680-000' },
                { icon: FiPhone, title: 'Telefone', content: '(11) 96714-7840' },
                { icon: FiMail, title: 'E-mail', content: 'contato@corretoryuri.com.br' },
                { icon: FiClock, title: 'Horário', content: 'Seg - Sex: 08h às 18h\nSábado: 08h às 12h' },
              ].map(info => (
                <div key={info.title} className="flex gap-4 p-5 border border-gray-200">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-white" size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{info.title}</p>
                    <p className="text-sm text-dark whitespace-pre-line leading-relaxed">{info.content}</p>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="flex gap-2 pt-2">
                <a href="https://wa.me/5511967147840" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-2.5 transition-colors">
                  <FaWhatsapp size={14} /> WhatsApp
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <FaInstagram size={14} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <FaFacebook size={14} />
                </a>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-7">Envie uma Mensagem</h2>

                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center mx-auto mb-4">
                      <FiCheckCircle className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-black uppercase text-dark mb-2">Mensagem enviada!</h3>
                    <p className="text-gray-500 text-sm mb-6">Retornaremos em breve pelo contato informado.</p>
                    <button onClick={() => setStatus(null)} className="btn-primary">
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                          Nome <span className="text-primary">*</span>
                        </label>
                        <input type="text" name="nome" value={form.nome} onChange={handleChange}
                          required placeholder="Seu nome completo" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                          E-mail <span className="text-primary">*</span>
                        </label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          required placeholder="seu@email.com" className="input-field" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                          Telefone
                        </label>
                        <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                          placeholder="(11) 9 0000-0000" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                          Assunto
                        </label>
                        <select name="assunto" value={form.assunto} onChange={handleChange} className="input-field">
                          <option value="">Selecione...</option>
                          <option value="compra">Quero comprar um imóvel</option>
                          <option value="aluguel">Quero alugar um imóvel</option>
                          <option value="vender">Quero vender meu imóvel</option>
                          <option value="visita">Agendar visita</option>
                          <option value="avaliacao">Avaliação de imóvel</option>
                          <option value="outro">Outro assunto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                        Mensagem <span className="text-primary">*</span>
                      </label>
                      <textarea name="mensagem" value={form.mensagem} onChange={handleChange}
                        required rows={5} placeholder="Como podemos ajudar?" className="input-field resize-none" />
                    </div>

                    {status === 'error' && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3">
                        Erro ao enviar. Tente pelo WhatsApp: (11) 96714-7840
                      </div>
                    )}

                    <button type="submit" disabled={status === 'loading'}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                      {status === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <><FiSend size={14} /> Enviar Mensagem</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
