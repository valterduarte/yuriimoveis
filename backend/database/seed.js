const { pool } = require('./db')

const imoveis = [
  {
    titulo: 'Casa com Vista para a Serra em Canela',
    descricao: 'Linda casa de 3 dormitórios com vista deslumbrante para as araucárias. Totalmente reformada, com acabamento de alto padrão. Lareira, churrasqueira coberta e jardim paisagístico. Localizada em bairro nobre e tranquilo de Canela.',
    tipo: 'venda', categoria: 'casa', preco: 680000, area: 220, quartos: 3, banheiros: 2, vagas: 2,
    endereco: 'Rua das Araucárias, 456', bairro: 'Bairro da Serra', cidade: 'Canela', destaque: true,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80','https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']),
    diferenciais: JSON.stringify(['Lareira', 'Churrasqueira', 'Jardim', 'Vista para a Serra', 'Garagem coberta']),
  },
  {
    titulo: 'Chalé de Luxo com Piscina Aquecida',
    descricao: 'Exclusivo chalé de madeira com piscina aquecida, sauna e vista panorâmica. Mobiliado e decorado com todo conforto. Ideal para moradia ou investimento em temporada.',
    tipo: 'venda', categoria: 'chale', preco: 950000, area: 180, quartos: 4, banheiros: 3, vagas: 2,
    endereco: 'Estrada da Serra, 789', bairro: 'Zona Rural', cidade: 'Canela', destaque: true,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80','https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80']),
    diferenciais: JSON.stringify(['Piscina aquecida', 'Sauna', 'Lareira', 'Mobiliado', 'Deck', 'Wi-Fi']),
  },
  {
    titulo: 'Apartamento Centro de Gramado',
    descricao: 'Apartamento moderno no coração de Gramado. 2 dormitórios com suíte, living amplo e varanda com vista para a cidade. A 5 minutos de caminhada do centro.',
    tipo: 'venda', categoria: 'apartamento', preco: 420000, area: 85, quartos: 2, banheiros: 2, vagas: 1,
    endereco: 'Rua Borges de Medeiros, 321', bairro: 'Centro', cidade: 'Gramado', destaque: true,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80']),
    diferenciais: JSON.stringify(['Suíte', 'Varanda', 'Portaria 24h', 'Elevador', 'Academia']),
  },
  {
    titulo: 'Terreno em Condomínio Fechado',
    descricao: 'Excelente terreno em condomínio fechado com 600m². Infraestrutura completa: ruas pavimentadas, rede de água, luz e esgoto. Área verde preservada e segurança 24h.',
    tipo: 'venda', categoria: 'terreno', preco: 185000, area: 600, quartos: 0, banheiros: 0, vagas: 0,
    endereco: 'Condomínio Verde Serrano', bairro: 'Zona Norte', cidade: 'Canela', destaque: true,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80']),
    diferenciais: JSON.stringify(['Condomínio fechado', 'Rua pavimentada', 'Área verde', 'Segurança 24h', 'Infraestrutura completa']),
  },
  {
    titulo: 'Casa para Alugar - 3 Quartos',
    descricao: 'Ótima casa para locação com 3 quartos, sendo 1 suíte. Sala ampla, cozinha moderna com armários planejados. Churrasqueira e garagem para 2 carros. Bairro residencial tranquilo.',
    tipo: 'aluguel', categoria: 'casa', preco: 2800, area: 160, quartos: 3, banheiros: 2, vagas: 2,
    endereco: 'Rua das Hortênsias, 88', bairro: 'Loteamento Vista Alegre', cidade: 'Canela', destaque: true,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80']),
    diferenciais: JSON.stringify(['Suíte', 'Churrasqueira', 'Garagem', 'Armários planejados']),
  },
  {
    titulo: 'Apartamento para Alugar - Centro',
    descricao: 'Apartamento 2 dormitórios no centro de Canela. Mobiliado, condomínio com piscina e salão de festas. Próximo a supermercados, farmácias e restaurantes.',
    tipo: 'aluguel', categoria: 'apartamento', preco: 1800, area: 65, quartos: 2, banheiros: 1, vagas: 1,
    endereco: 'Rua Osvaldo Aranha, 199', bairro: 'Centro', cidade: 'Canela', destaque: true,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80']),
    diferenciais: JSON.stringify(['Mobiliado', 'Piscina', 'Salão de festas', 'Portaria']),
  },
  {
    titulo: 'Sala Comercial - Centro de Canela',
    descricao: 'Sala comercial de 45m² no coração de Canela. Ideal para escritório, clínica ou comércio. Bem iluminada, ar-condicionado e vaga de garagem inclusa.',
    tipo: 'aluguel', categoria: 'comercial', preco: 2200, area: 45, quartos: 0, banheiros: 1, vagas: 1,
    endereco: 'Rua João Pessoa, 45', bairro: 'Centro', cidade: 'Canela', destaque: false,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80']),
    diferenciais: JSON.stringify(['Ar-condicionado', 'Vaga garagem', 'Centro', 'Recepção']),
  },
  {
    titulo: 'Chácara com Casa e Pomar',
    descricao: 'Linda chácara de 5.000m² com casa de 3 quartos, galpão, pomar de maçãs e uvas. Água de mina, horta e vista panorâmica. A apenas 15 minutos de Canela.',
    tipo: 'venda', categoria: 'chacara', preco: 520000, area: 5000, quartos: 3, banheiros: 2, vagas: 4,
    endereco: 'Estrada Interior, km 5', bairro: 'Interior', cidade: 'São Francisco de Paula', destaque: false,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80']),
    diferenciais: JSON.stringify(['Pomar', 'Galpão', 'Água de mina', 'Horta', 'Vista panorâmica']),
  },
  {
    titulo: 'Casa Alto Padrão em Gramado',
    descricao: 'Sofisticada residência em estilo europeu com 4 suítes, sala de home theater, adega e piscina aquecida coberta. Localizada em rua nobre de Gramado, próxima ao centro.',
    tipo: 'venda', categoria: 'casa', preco: 1850000, area: 380, quartos: 4, banheiros: 4, vagas: 3,
    endereco: 'Rua Hamburguer Straße, 250', bairro: 'Moinhos', cidade: 'Gramado', destaque: false,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80']),
    diferenciais: JSON.stringify(['4 Suítes', 'Home Theater', 'Adega', 'Piscina aquecida coberta', 'Sauna', 'Jardim europeu']),
  },
  {
    titulo: 'Terreno para Construção - Bairro Nobre',
    descricao: 'Terreno plano de 400m² em bairro nobre de Canela. Ótima topografia, toda infraestrutura no local. Vizinhança tranquila e próximo às principais vias.',
    tipo: 'venda', categoria: 'terreno', preco: 145000, area: 400, quartos: 0, banheiros: 0, vagas: 0,
    endereco: 'Rua das Camélias, 33', bairro: 'Bairro Nobre', cidade: 'Canela', destaque: false,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80']),
    diferenciais: JSON.stringify(['Plano', 'Infraestrutura completa', 'Bairro nobre']),
  },
  {
    titulo: 'Studio Mobiliado para Temporada',
    descricao: 'Studio completamente mobiliado e equipado, ideal para temporada ou moradia. Decoração moderna, Wi-Fi, Netflix e cozinha completa. A 2 quadras do centro.',
    tipo: 'aluguel', categoria: 'apartamento', preco: 1200, area: 35, quartos: 1, banheiros: 1, vagas: 1,
    endereco: 'Rua Getúlio Vargas, 77', bairro: 'Centro', cidade: 'Canela', destaque: false,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80']),
    diferenciais: JSON.stringify(['Mobiliado', 'Wi-Fi', 'Netflix', 'Cozinha completa', 'Centro']),
  },
  {
    titulo: 'Prédio Comercial - Oportunidade de Investimento',
    descricao: 'Prédio comercial com 3 andares no centro de Canela. Térreo com loja de 120m², 2 andares de salas comerciais. Excelente renda com locatários já estabelecidos.',
    tipo: 'venda', categoria: 'comercial', preco: 2200000, area: 450, quartos: 0, banheiros: 6, vagas: 10,
    endereco: 'Rua Osvaldo Aranha, 500', bairro: 'Centro', cidade: 'Canela', destaque: false,
    imagens: JSON.stringify(['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80']),
    diferenciais: JSON.stringify(['3 andares', 'Renda gerada', 'Centro', 'Estacionamento', 'Elevador']),
  },
]

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM imoveis')
  if (parseInt(rows[0].count) > 0) {
    console.log(`ℹ️  Database já populado (${rows[0].count} imóveis)`)
    return
  }

  for (const im of imoveis) {
    await pool.query(`
      INSERT INTO imoveis (titulo, descricao, tipo, categoria, preco, area, quartos, banheiros, vagas, endereco, bairro, cidade, destaque, imagens, diferenciais)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    `, [im.titulo, im.descricao, im.tipo, im.categoria, im.preco, im.area, im.quartos, im.banheiros, im.vagas, im.endereco, im.bairro, im.cidade, im.destaque, im.imagens, im.diferenciais])
  }

  console.log(`✅ Seed: ${imoveis.length} imóveis inseridos`)
}

module.exports = seed
