const { sql } = require("../config/db");

class ImovelController {
//Listagem de imoveis por filtro de pesquisa
  async list(search) {
    const baseQuery = sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
    `;

    const whereClause = search ? sql`
      WHERE i.titulo ILIKE '%' || ${search} || '%'
         OR CAST(i.preco AS TEXT) ILIKE '%' || ${search} || '%'
         OR i.localizacao ILIKE '%' || ${search} || '%'
    ` : sql``;

    const orderClause = sql`GROUP BY i.id ORDER BY i.id ASC`;

    const imoveis = await sql`${baseQuery} ${whereClause} ${orderClause}`;
    return imoveis;
  }
//Busca um imóvel por ID
async findById(id) {
  try {
    const [imovel] = await sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
      WHERE i.id = ${id}
      GROUP BY i.id
    `;
    return imovel || null;
  } catch (error) {
    console.error('Erro no findById:', error);
    throw new Error('Erro ao buscar imóvel no banco de dados');
  }
}

//criacao de imovel
  async create(imovel) {
    const { titulo, descricao, imagens = [], preco, area, quartos, 
            banheiros, status, categoria_id, localizacao_id } = imovel;

    const [novoImovel] = await sql`
      INSERT INTO imoveis (
        titulo, descricao, preco, area, quartos, banheiros, status,
        categoria_id, localizacao_id
      ) VALUES (
        ${titulo}, ${descricao}, ${preco}, ${area}, ${quartos},
        ${banheiros}, ${status}, ${categoria_id}, ${localizacao_id}
      ) RETURNING *;
    `;

    await this._insertImages(novoImovel.id, imagens);
    return novoImovel;
  }

//actualizacao de imovel
  async update(id, imovel) {
    const { titulo, descricao, preco, area, quartos, banheiros,
            status, categoria_id, localizacao_id, imagens = [] } = imovel;

    const [imovelAtualizado] = await sql`
      UPDATE imoveis SET
        titulo = ${titulo},
        descricao = ${descricao},
        preco = ${preco},
        area = ${area},
        quartos = ${quartos},
        banheiros = ${banheiros},
        status = ${status},
        categoria_id = ${categoria_id},
        localizacao_id = ${localizacao_id}
      WHERE id = ${id}
      RETURNING *;
    `;

    await this._updateImages(id, imagens);
    return imovelAtualizado;
  }

//Exclusao de imovel
  async delete(id) {
    // Primeiro remove as imagens associadas
    await sql`DELETE FROM imagens WHERE imovel_id = ${id}`;
    
    // Depois remove o imóvel
    const result = await sql`DELETE FROM imoveis WHERE id = ${id}`;
    
    return result.count > 0;
  }
//Listagem de
  async listByCategory(categoriaId) {
    const imoveis = await sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
      WHERE i.categoria_id = ${categoriaId}
      GROUP BY i.id
      ORDER BY i.id ASC
    `;
    
    return imoveis;
  }
//listagem de imoveis por status
  async listByStatus(status) {
    const imoveis = await sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
      WHERE i.status = ${status}
      GROUP BY i.id
      ORDER BY i.id ASC
    `;
    
    return imoveis;
  }
    /**
   * Lista imóveis por status
   * @param {string} status - Status do imóvel
   * @returns {Promise<Array>} Lista de imóveis
   */
  async listByStatus(status) {
    const imoveis = await sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
      WHERE i.status = ${status}
      GROUP BY i.id
      ORDER BY i.id ASC
    `;
    
    return imoveis;
  }

//inserir imagens
  async _insertImages(imovelId, urls) {
    if (!urls.length) return;

    for (const url of urls) {
      await sql`
        INSERT INTO imagens (url, imovel_id)
        VALUES (${url}, ${imovelId});
      `;
    }
  }

//actualizar umagens
  async _updateImages(imovelId, urls) {
    await sql`DELETE FROM imagens WHERE imovel_id = ${imovelId}`;
    await this._insertImages(imovelId, urls);
  }
}

module.exports = ImovelController;