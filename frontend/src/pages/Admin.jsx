import { useState, useEffect, useRef } from 'react'
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const CLOUDINARY_CLOUD = 'dfl3eskr9'
const CLOUDINARY_PRESET = 'Yuri-upload'

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
  status: 'pronto',
  preco: '', area: '', quartos: '', banheiros: '', vagas: '',
  endereco: '', bairro: '', cidade: 'Osasco', cep: '',
  destaque: false, imagens: '', diferenciais: '',
}

function imovelParaForm(im) {
  return {
    titulo: im.titulo || '',
    descricao: im.descricao || '',
    tipo: im.tipo || 'venda',
    categoria: im.categoria || 'apartamento',
    status: im.status || 'pronto',
    preco: im.preco || '',
    area: im.area || '',
    quartos: im.quartos || '',
    banheiros: im.banheiros || '',
    vagas: im.vagas || '',
    endereco: im.endereco || '',
    bairro: im.bairro || '',
    cidade: im.cidade || 'Osasco',
    cep: im.cep || '',
    destaque: im.destaque || false,
    imagens: Array.isArray(im.imagens) ? im.imagens.join('\n') : '',
    diferenciais: Array.isArray(im.diferenciais) ? im.diferenciais.join('\n') : '',
  }
}

export default function Admin() {
  const [apiKey, setApiKey] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [tela, setTela] = useState('lista') // 'lista' | 'form'
  const [editandoId, setEditandoId] = useState(null)
  const [imoveis, setImoveis] = useState([])
  const [form, setForm] = useState(camposVazios)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [uploadando, setUploadando] = useState(false)
  const [imagensUrls, setImagensUrls] = useState([])
  const inputFileRef = useRef(null)

  const autenticar = (e) => {
    e.preventDefault()
    if (apiKey.trim()) setAutenticado(true)
    else setMsg({ tipo: 'erro', texto: 'Informe a API Key.' })
  }

  const carregarImoveis = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/imoveis?limit=50&ordem=recente`)
      setImoveis(res.data.imoveis || [])
    } catch {
      setImoveis([])
    }
  }

  useEffect(() => {
    if (autenticado) carregarImoveis()
  }, [autenticado])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const abrirNovo = () => {
    setEditandoId(null)
    setForm(camposVazios)
    setImagensUrls([])
    setMsg(null)
    setTela('form')
  }

  const abrirEdicao = async (id) => {
    setMsg(null)
    try {
      const res = await axios.get(`${API_URL}/api/imoveis/${id}`)
      setForm(imovelParaForm(res.data))
      setImagensUrls(Array.isArray(res.data.imagens) ? res.data.imagens : [])
      setEditandoId(id)
      setTela('form')
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao carregar imóvel.' })
    }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploadando(true)
    try {
      const uploads = await Promise.all(files.map(async (file) => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', CLOUDINARY_PRESET)
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          data
        )
        return res.data.secure_url
      }))
      setImagensUrls(prev => [...prev, ...uploads])
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao fazer upload das imagens.' })
    } finally {
      setUploadando(false)
      e.target.value = ''
    }
  }

  const removerImagem = (url) => {
    setImagensUrls(prev => prev.filter(u => u !== url))
  }

  const desativar = async (id) => {
    if (!confirm('Desativar este imóvel?')) return
    try {
      await axios.put(`${API_URL}/api/imoveis/${id}`, { ativo: false }, {
        headers: { 'x-api-key': apiKey },
      })
      carregarImoveis()
    } catch {
      alert('Erro ao desativar.')
    }
  }

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
        imagens: imagensUrls,
        diferenciais: form.diferenciais ? form.diferenciais.split('\n').map(s => s.trim()).filter(Boolean) : [],
      }
      if (editandoId) {
        await axios.put(`${API_URL}/api/imoveis/${editandoId}`, payload, {
          headers: { 'x-api-key': apiKey },
        })
        setMsg({ tipo: 'ok', texto: 'Imóvel atualizado com sucesso!' })
      } else {
        const res = await axios.post(`${API_URL}/api/imoveis`, payload, {
          headers: { 'x-api-key': apiKey },
        })
        setMsg({ tipo: 'ok', texto: `Imóvel cadastrado com sucesso! ID: ${res.data.id}` })
        setForm(camposVazios)
        setEditandoId(null)
      }
      carregarImoveis()
    } catch (err) {
      setMsg({ tipo: 'erro', texto: err.response?.data?.error || 'Erro ao salvar.' })
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
            <input type="password" placeholder="API Key" value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
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
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <span className="section-label">Admin</span>
            <h1 className="text-3xl font-black uppercase text-white">
              {tela === 'lista' ? 'Imóveis Cadastrados' : editandoId ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
          </div>
          {tela === 'lista' ? (
            <button onClick={abrirNovo} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
              <FiPlus size={14} /> Novo Imóvel
            </button>
          ) : (
            <button onClick={() => { setTela('lista'); setMsg(null) }}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
              ← Voltar
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {msg && (
          <div className={`mb-6 px-4 py-3 text-sm border ${msg.tipo === 'ok' ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600'}`}>
            {msg.texto}
          </div>
        )}

        {/* Lista */}
        {tela === 'lista' && (
          <div className="space-y-3">
            {imoveis.length === 0 ? (
              <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-400">
                Nenhum imóvel cadastrado.
              </div>
            ) : imoveis.map(im => (
              <div key={im.id} className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-dark">{im.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {im.categoria} · {im.tipo} · ID {im.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => abrirEdicao(im.id)}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">
                    <FiEdit2 size={12} /> Editar
                  </button>
                  <button onClick={() => desativar(im.id)}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:underline">
                    <FiTrash2 size={12} /> Desativar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulário */}
        {tela === 'form' && (
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
                <div className="grid grid-cols-3 gap-4">
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
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Status</label>
                    <select value={form.status} onChange={e => set('status', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                      <option value="pronto">Pronto para morar</option>
                      <option value="construcao">Em construção</option>
                      <option value="planta">Na planta</option>
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
              <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)}
                rows={14} placeholder="Cole o template acima e edite..."
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y font-mono" />
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
              <p className="text-[10px] text-gray-400 mb-4">Selecione uma ou mais fotos do seu computador.</p>

              <input ref={inputFileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              <button type="button" onClick={() => inputFileRef.current.click()} disabled={uploadando}
                className="flex items-center gap-2 border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 w-full justify-center">
                <FiUpload size={14} />
                {uploadando ? 'Enviando...' : 'Selecionar fotos'}
              </button>

              {imagensUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {imagensUrls.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-full h-24 object-cover border border-gray-200" />
                      <button type="button" onClick={() => removerImagem(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-4 text-sm uppercase tracking-widest font-bold disabled:opacity-50">
              {loading ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
