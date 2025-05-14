const { sql } = require('../config/db');

class LocalizacaoController {
  // Listar localizações
  async list(search) {
    const localizacao = await sql`SELECT * FROM localizacao ORDER BY id ASC`;
    return localizacao;
  }

  // Criar localização
  async create(localizacaoData) {
    const { endereco, cidade } = localizacaoData;
    await sql`INSERT INTO localizacao (endereco, cidade) VALUES (${endereco}, ${cidade})`;
  }

  // Atualizar localização
  async update(id, localizacaoData) {
    const { endereco, cidade } = localizacaoData;
    await sql`
      UPDATE localizacao SET endereco = ${endereco}, cidade = ${cidade} WHERE id = ${id}
    `;
  }

  // Deletar localização
  async delete(id) {
    await sql`DELETE FROM localizacao WHERE id = ${id}`;
  }

  // Buscar localização por ID
  async findById(id) {
    const localizacao = await sql`SELECT * FROM localizacao WHERE id = ${id}`;
    return localizacao[0];
  }
}

module.exports = {
  LocalizacaoController,
};
