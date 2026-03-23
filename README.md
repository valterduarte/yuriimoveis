# Corretor Yuri Imóveis

Site imobiliário completo com frontend React e backend Node.js.

## Estrutura

```
CorretorYuri/
├── frontend/     # React + Vite + TailwindCSS
└── backend/      # Node.js + Express + SQLite
```

## Como rodar

### Backend
```bash
cd backend
npm start
# Rodará na porta 3001
```

### Frontend
```bash
cd frontend
npm run dev
# Rodará na porta 5173
```

Acesse: http://localhost:5173

## Páginas
- `/` — Home com busca, destaques e depoimentos
- `/imoveis` — Listagem com filtros avançados
- `/imoveis/:id` — Detalhes do imóvel
- `/quem-somos` — Sobre a empresa e equipe
- `/contato` — Formulário de contato

## API Endpoints
- `GET /api/imoveis` — Lista imóveis (filtros: tipo, categoria, cidade, precoMin, precoMax, quartos, destaque, ordem, page, limit)
- `GET /api/imoveis/:id` — Detalhes do imóvel
- `POST /api/imoveis` — Criar imóvel
- `PUT /api/imoveis/:id` — Atualizar imóvel
- `DELETE /api/imoveis/:id` — Remover imóvel (soft delete)
- `POST /api/contato` — Enviar mensagem de contato
- `GET /api/contato` — Listar contatos (admin)
