import { FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const equipe = [
  {
    nome: 'Yuri Corretor',
    cargo: 'Corretor de Imóveis · CRECI 12345',
    descricao: 'Especialista em imóveis residenciais e comerciais com mais de 10 anos de experiência em Osasco e região.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    nome: 'Fernanda Silva',
    cargo: 'Corretora de Imóveis · CRECI 67890',
    descricao: 'Especialista em imóveis de alto padrão, chalés e propriedades rurais da região serrana.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    nome: 'Roberto Matos',
    cargo: 'Especialista em Terrenos · CRECI 11223',
    descricao: 'Com foco em terrenos e loteamentos, ajuda clientes a encontrar o local perfeito para construir.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
]

const valores = ['Ética', 'Compromisso', 'Excelência', 'Confiança', 'Transparência', 'Inovação']

export default function QuemSomos() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">

      {/* Hero */}
      <section className="relative py-24 bg-dark text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative container mx-auto px-6">
          <span className="section-label">Sobre nós</span>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-4">
            Quem Somos
          </h1>
          <p className="text-gray-300 text-base max-w-xl">
            Conheça a equipe do Corretor Yuri e nossa história de dedicação ao mercado imobiliário de Osasco e região
          </p>
        </div>
      </section>

      {/* História */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Nossa História</span>
              <h2 className="section-title mb-6">Mais de 10 anos<br />realizando sonhos</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  O Corretor Yuri nasceu do desejo de oferecer um serviço imobiliário diferenciado em Osasco e região, com foco na satisfação do cliente e em negócios transparentes e seguros.
                </p>
                <p>
                  Fundado em 2014 em Osasco - SP, nos tornamos referência regional em compra, venda e locação de imóveis residenciais e comerciais. Nossa equipe de corretores especializados conhece cada detalhe da região.
                </p>
                <p>
                  Com mais de 500 imóveis comercializados e 1.000 famílias atendidas, continuamos crescendo com o mesmo propósito:{' '}
                  <strong className="text-dark">fazer com que cada cliente encontre o imóvel perfeito.</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                {[
                  { value: '10+', label: 'Anos de mercado' },
                  { value: '500+', label: 'Imóveis vendidos' },
                  { value: '1000+', label: 'Famílias atendidas' },
                  { value: '4.9★', label: 'Avaliação média' },
                ].map(s => (
                  <div key={s.label} className="border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-black text-primary">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
                alt="Escritório Corretor Yuri"
                className="w-full h-80 object-cover"
              />
              <div className="absolute -bottom-5 -right-5 bg-primary text-white p-6">
                <p className="text-3xl font-black">10+</p>
                <p className="text-xs uppercase tracking-widest text-white/80 mt-0.5">Anos de experiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão/Visão/Valores */}
      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-label">Nossos Princípios</span>
            <h2 className="text-4xl font-black text-white uppercase">O que nos guia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-700">
            {[
              { title: 'Missão', text: 'Facilitar o acesso à moradia e ao investimento imobiliário, oferecendo serviços de excelência com ética e transparência.' },
              { title: 'Visão', text: 'Ser a imobiliária mais reconhecida e respeitada de Osasco e região, referência em inovação e atendimento ao cliente.' },
              { title: 'Valores', text: valores.join(' · ') },
            ].map((item, i) => (
              <div key={item.title} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-gray-700' : ''}`}>
                <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-3">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="font-black text-white text-xl uppercase mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-label">Equipe</span>
            <h2 className="section-title">Nossos Especialistas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {equipe.map(m => (
              <div key={m.nome} className="bg-white group overflow-hidden">
                <div className="overflow-hidden" style={{ height: 260 }}>
                  <img src={m.img} alt={m.nome}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6 border border-t-0 border-gray-200 group-hover:border-primary transition-colors">
                  <h3 className="font-black text-dark text-base uppercase mb-0.5">{m.nome}</h3>
                  <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-3">{m.cargo}</p>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">{m.descricao}</p>
                  <a href={`https://wa.me/5511967147840?text=Olá ${m.nome.split(' ')[0]}, gostaria de saber sobre um imóvel.`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-green-600 hover:text-green-700 transition-colors">
                    <FaWhatsapp size={14} /> Falar com {m.nome.split(' ')[0]}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="section-label">Por que nos escolher</span>
              <h2 className="section-title mb-4">Nossos Diferenciais</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Trabalhamos com dedicação total para oferecer a melhor experiência em cada negócio imobiliário.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                'Atendimento 100% personalizado',
                'Corretores com CRECI ativo',
                'Análise jurídica de documentos',
                'Portfólio amplo e exclusivo',
                'Negociação transparente',
                'Suporte pós-venda completo',
                'Conhecimento profundo da região',
                'Atendimento nos finais de semana',
              ].map(d => (
                <div key={d} className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <FiCheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-sm text-gray-700">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black uppercase mb-4">Vamos realizar<br />seu sonho juntos?</h2>
          <p className="text-white/70 text-sm mb-10 max-w-md mx-auto">
            Entre em contato com nossa equipe agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/5511967147840" target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-gray-100 transition-colors">
              <FaWhatsapp size={16} /> WhatsApp
            </a>
            <Link to="/contato"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-white/10 transition-colors">
              Formulário <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
