const { sql } = require("../models/db");

class TerrenoController {
//lista de terrenos com filtro de pesquisa
  async list(search) {
    const baseQuery = sql`
      SELECT t.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM terrenos t
      LEFT JOIN imagens img ON t.id = img.terreno_id
    `;

    const whereClause = search ? sql`
      WHERE t.titulo ILIKE '%' || ${search} || '%'
         OR CAST(t.preco AS TEXT) ILIKE '%' || ${search} || '%'
         OR t.localizacao ILIKE '%' || ${search} || '%'
    ` : sql``;

    const orderClause = sql`GROUP BY t.id ORDER BY t.id ASC`;

    const terrenos = await sql`${baseQuery} ${whereClause} ${orderClause}`;
    return terrenos;
  }

//Listagem de terrenos por id
  async findById(id) {
    const [terreno] = await sql`
      SELECT t.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM terrenos t
      LEFT JOIN imagens img ON t.id = img.terreno_id
      WHERE t.id = ${id}
      GROUP BY t.id
    `;
    
    return terreno || null;
  }

//criacao de um terreno
  async create(terreno) {
    const { titulo, descricao, imagens = [], preco, area, localizacao_id } = terreno;

    const [novoTerreno] = await sql`
      INSERT INTO terrenos (
        titulo, descricao, preco, area, localizacao_id
      ) VALUES (
        ${titulo}, ${descricao}, ${preco}, ${area}, ${localizacao_id}
      ) RETURNING *;
    `;

    await this._insertImages(novoTerreno.id, imagens);
    return novoTerreno;
  }

//Actualizacao de terreno
  async update(id, terreno) {
    const { titulo, descricao, imagens = [], preco, area, localizacao_id } = terreno;

    const [terrenoAtualizado] = await sql`
      UPDATE terrenos SET
        titulo = ${titulo},
        descricao = ${descricao},
        preco = ${preco},
        area = ${area},
        localizacao_id = ${localizacao_id}
      WHERE id = ${id}
      RETURNING *;
    `;

    await this._updateImages(id, imagens);
    return terrenoAtualizado;
  }

//Remocao de terreno
  async delete(id) {
    // Primeiro remove as imagens associadas
    await sql`DELETE FROM imagens WHERE terreno_id = ${id}`;
    
    // Depois remove o terreno
    const result = await sql`DELETE FROM terrenos WHERE id = ${id}`;
    
    return result.count > 0;
  }

//listagem de terrenos por localizacao
  async listByLocation(localizacaoId) {
    const terrenos = await sql`
      SELECT t.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM terrenos t
      LEFT JOIN imagens img ON t.id = img.terreno_id
      WHERE t.localizacao_id = ${localizacaoId}
      GROUP BY t.id
      ORDER BY t.id ASC
    `;
    
    return terrenos;
  }

//Listagem de terrenos por Range de preco
  async listByPriceRange(minPrice, maxPrice) {
    const terrenos = await sql`
      SELECT t.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM terrenos t
      LEFT JOIN imagens img ON t.id = img.terreno_id
      WHERE t.preco BETWEEN ${minPrice} AND ${maxPrice}
      GROUP BY t.id
      ORDER BY t.preco ASC
    `;
    
    return terrenos;
  }
  //
    async _insertImages(terrenoId, urls) {
    if (!urls.length) return;

    for (const url of urls) {
      await sql`
        INSERT INTO imagens (url, terreno_id)
        VALUES (${url}, ${terrenoId});
      `;
    }
  }

  /**
   * Método privado para atualizar imagens
   * @param {number} terrenoId - ID do terreno
   * @param {Array<string>} urls - URLs das novas imagens
   */
  async _updateImages(terrenoId, urls) {
    await sql`DELETE FROM imagens WHERE terreno_id = ${terrenoId}`;
    await this._insertImages(terrenoId, urls);
  }
}

module.exports = TerrenoController;