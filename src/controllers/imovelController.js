import { sql } from '../models/db.js';

export class imovelController {
  // Listar imóveis (com busca opcional)
  async list(search) {
    let imoveis;

    if (search) {
      imoveis = await sql`
        SELECT * FROM imoveis 
        WHERE titulo ILIKE ${'%' + search + '%'}
      `;
    } else {
      imoveis = await sql`SELECT * FROM imoveis`;
    }

    return imoveis;
  }

  // Criar novo imóvel
  async create(imovel) {
    const { titulo, categoria, localizacao, preco, quartos, banheiros, area, status, descricacao, imagens } = imovel;

    const result = await sql`
      INSERT INTO imoveis 
      (titulo, categoria, localizacao, preco, quartos, banheiros, area, status, descricacao)
      VALUES (${titulo}, ${categoria}, ${localizacao}, ${preco}, ${quartos}, ${banheiros}, ${area}, ${status}, ${descricacao})
      RETURNING id
    `;

    const imovelId = result[0].id;

    if (Array.isArray(imagens)) {
      for (const filename of imagens) {
        await sql`
          INSERT INTO imagens (imovel_id, nome_arquivo)
          VALUES (${imovelId}, ${filename})
        `;
      }
    }

    return imovelId;
  }

  // Atualizar imóvel por ID (e substituir imagens)
  async update(id, dados) {
    const { titulo, categoria, localizacao, preco, quartos, banheiros, area, status, descricacao, imagens } = dados;

    await sql`
      UPDATE imoveis SET
        titulo = ${titulo},
        categoria = ${categoria},
        localizacao = ${localizacao},
        preco = ${preco},
        quartos = ${quartos},
        banheiros = ${banheiros},
        area = ${area},
        status = ${status},
        descricacao = ${descricacao}
      WHERE id = ${id}
    `;

    // Apagar imagens antigas
    await sql`DELETE FROM imagens WHERE imovel_id = ${id}`;

    // Inserir novas imagens
    if (Array.isArray(imagens)) {
      for (const filename of imagens) {
        await sql`
          INSERT INTO imagens (imovel_id, nome_arquivo)
          VALUES (${id}, ${filename})
        `;
      }
    }
  }

  // Deletar imóvel
  async delete(id) {
    await sql`DELETE FROM imagens WHERE imovel_id = ${id}`;
    await sql`DELETE FROM imoveis WHERE id = ${id}`;
  }

  // Buscar imóvel por ID
  async getById(id) {
    const imovel = await sql`SELECT * FROM imoveis WHERE id = ${id}`;
    const imagens = await sql`SELECT nome_arquivo FROM imagens WHERE imovel_id = ${id}`;

    return {
      ...imovel[0],
      imagens: imagens.map(img => img.nome_arquivo),
    };
  }
}
