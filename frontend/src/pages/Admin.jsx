import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const DESCRICAO_TEMPLATE = `🏢 NOME DO EMPREENDIMENTO – CIDADE

✨ Subtítulo chamativo!
Conforto, segurança e lazer completo para você e sua família.

▶️ Ponto de destaque 1
▶️ Ponto de destaque 2
▶️ Ponto de destaque 3

🔑 Diferenciais do empreendimento:
✔ Item 1
✔ Item 2
✔ Item 3

📐 Plantas disponíveis:
X dormitórios — XXm²
A partir de *R$ 000.000`

const camposVazios = {
  titulo: '', descricao: '', tipo: 'venda', categoria: 'apartamento',
  preco: '', area: '', quartos: '', banheiros: '', vagas: '',
  endereco: '', bairro: '', cidade: 'Osasco', cep: '',
  destaque: false, imagens: '', diferenciais: '',
}

export default function Admin() {
  const [apiKey, setApiKey] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [form, setForm] = useState(camposVazios)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const autenticar = (e) => {
    e.preventDefault()
    if (apiKey.trim()) setAutenticado(true)
    else setMsg({ tipo: 'erro', texto: 'Informe a API Key.' })
  }

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const payload = {
        ...form,
        preco: Number(form.preco),
        area: Number(form.area) || 0,
        quartos: Number(form.quartos) || 0,
        banheiros: Number(form.banheiros) || 0,
        vagas: Number(form.vagas) || 0,
        imagens: form.imagens ? form.imagens.split('\n').map(s => s.trim()).filter(Boolean) : [],
        diferenciais: form.diferenciais ? form.diferenciais.split('\n').map(s => s.trim()).filter(Boolean) : [],
      }
      const res = await axios.post(`${API_URL}/api/imoveis`, payload, {
        headers: { 'x-api-key': apiKey },
      })
      setMsg({ tipo: 'ok', texto: `Imóvel cadastrado com sucesso! ID: ${res.data.id}` })
      setForm(camposVazios)
    } catch (err) {
      setMsg({ tipo: 'erro', texto: err.response?.data?.error || 'Erro ao cadastrar.' })
    } finally {
      setLoading(false)
    }
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Acesso Admin</h1>
          <form onSubmit={autenticar} className="space-y-4">
            <input
              type="password"
              placeholder="API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            {msg && <p className="text-xs text-red-500">{msg.texto}</p>}
            <button type="submit" className="w-full btn-primary py-3 text-xs">Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-10">
        <div className="container mx-auto px-6">
          <span className="section-label">Admin</span>
          <h1 className="text-3xl font-black uppercase text-white">Cadastrar Imóvel</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {msg && (
          <div className={`mb-6 px-4 py-3 text-sm border ${msg.tipo === 'ok' ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600'}`}>
            {msg.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Informações básicas */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-5">Informações Básicas</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Título *</label>
                <input value={form.titulo} onChange={e => set('titulo', e.target.value)} required
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Finalidade *</label>
                  <select value={form.tipo} onChange={e => set('tipo', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Categoria *</label>
                  <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="terreno">Terreno</option>
                    <option value="chale">Chalé</option>
                    <option value="comercial">Comercial</option>
                    <option value="chacara">Chácara</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Preço (R$) *</label>
                  <input type="number" value={form.preco} onChange={e => set('preco', e.target.value)} required
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Área (m²)</label>
                  <input type="number" value={form.area} onChange={e => set('area', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Quartos</label>
                  <input type="number" value={form.quartos} onChange={e => set('quartos', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Banheiros</label>
                  <input type="number" value={form.banheiros} onChange={e => set('banheiros', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Vagas</label>
                  <input type="number" value={form.vagas} onChange={e => set('vagas', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="destaque" checked={form.destaque} onChange={e => set('destaque', e.target.checked)}
                  className="w-4 h-4 accent-primary" />
                <label htmlFor="destaque" className="text-xs text-gray-600 uppercase tracking-widest font-bold">Imóvel em destaque</label>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-5">Localização</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Endereço</label>
                <input value={form.endereco} onChange={e => set('endereco', e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Bairro</label>
                  <input value={form.bairro} onChange={e => set('bairro', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Cidade</label>
                  <input value={form.cidade} onChange={e => set('cidade', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Descrição</h2>
            <p className="text-[10px] text-gray-400 mb-3">Use o template abaixo como base. Cada linha vira uma linha na página.</p>
            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 mb-3 text-xs text-gray-500 font-mono leading-relaxed whitespace-pre-line">
              {DESCRICAO_TEMPLATE}
            </div>
            <textarea
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              rows={14}
              placeholder="Cole o template acima e edite..."
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y font-mono"
            />
            <button type="button" onClick={() => set('descricao', DESCRICAO_TEMPLATE)}
              className="mt-2 text-[10px] uppercase tracking-widest text-primary font-bold hover:underline">
              Preencher com template
            </button>
          </div>

          {/* Diferenciais */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Diferenciais</h2>
            <p className="text-[10px] text-gray-400 mb-3">Um item por linha. Ex: Piscina aquecida</p>
            <textarea value={form.diferenciais} onChange={e => set('diferenciais', e.target.value)}
              rows={5} placeholder={"Piscina aquecida\nPortaria 24h\nAcademia"}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y" />
          </div>

          {/* Imagens */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Imagens</h2>
            <p className="text-[10px] text-gray-400 mb-3">Uma URL por linha.</p>
            <textarea value={form.imagens} onChange={e => set('imagens', e.target.value)}
              rows={5} placeholder={"https://exemplo.com/foto1.jpg\nhttps://exemplo.com/foto2.jpg"}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary py-4 text-sm uppercase tracking-widest font-bold disabled:opacity-50">
            {loading ? 'Cadastrando...' : 'Cadastrar Imóvel'}
          </button>
        </form>
      </div>
    </div>
  )
}
