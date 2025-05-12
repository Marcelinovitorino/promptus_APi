const { sql } = require("../models/db");

class ImovelController {
  // Métodos para o controlador
  async list(search) {
    let imoveis;

    if (search) {
      imoveis = await sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
      WHERE i.titulo ILIKE '%' || ${search} || '%'
         OR CAST(i.preco AS TEXT) ILIKE '%' || ${search} || '%'
         OR i.localizacao ILIKE '%' || ${search} || '%'
      GROUP BY i.id
      ORDER BY i.id ASC
    `;
    } else {
      imoveis = await sql`
      SELECT i.*, 
        COALESCE(json_agg(img.url) FILTER (WHERE img.url IS NOT NULL), '[]') AS imagens
      FROM imoveis i
      LEFT JOIN imagens img ON i.id = img.imovel_id
      GROUP BY i.id
      ORDER BY i.id ASC
    `;
    }

    return imoveis;
  }

  //
async create(imovel) {
  const {
    titulo,
    descricao,
    imagens, // array de URLs de imagens
    preco,
    area,
    quartos,
    banheiros,
    status,
    categoria_id,
    localizacao_id
  } = imovel;

  // Primeiro, cria o imóvel
  const [Imovel] = await sql`
    INSERT INTO imoveis (
      titulo, descricao, preco, area, quartos, banheiros, status,
      categoria_id, localizacao_id
    )
    VALUES (
      ${titulo}, ${descricao}, ${preco}, ${area}, ${quartos},
      ${banheiros}, ${status}, ${categoria_id}, ${localizacao_id}
    )
    RETURNING *;
  `;

  // Em seguida, insere as imagens relacionadas ao imóvel (se houver)
  if (Array.isArray(imagens) && imagens.length > 0) {
    for (const url of imagens) {
      await sql`
        INSERT INTO imagens (url, imovel_id)
        VALUES (${url}, ${Imovel.id});
      `;
    }
  }

  return Imovel;
}


  async update(id, imovel) {
    // ...
  }

  async delete(id) {
    // ...
  }

  async findById(id) {
    // ...
  }
}

module.exports = ImovelController;
