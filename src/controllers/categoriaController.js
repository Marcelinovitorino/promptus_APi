const { sql } = require('../models/db');

class CategoriaController {
  // Método de listagem de categoria
  async list() {
    const categoria = await sql`SELECT * FROM categoria ORDER BY id ASC`;
    return categoria;
  }

  // Método de criação de categoria
  async create(categoria) {
    const { nome } = categoria;
    await sql`
      INSERT INTO categoria (nome) 
      VALUES (${nome})`;
  }

  // Método de atualização de categoria
  async update(id, categoria) {
    const { nome } = categoria;
    await sql`
      UPDATE categoria 
      SET nome = ${nome} 
      WHERE id = ${id}`;
  }

  // Método de exclusão de categoria
  async delete(id) {
    await sql`DELETE FROM categoria WHERE id = ${id}`;
  }
}

module.exports = {
  CategoriaController,
};
