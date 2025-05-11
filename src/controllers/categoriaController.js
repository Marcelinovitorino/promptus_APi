import { sql } from "./db.js";

export class DatabasePostgress {
  //Metodo de listagem de categoria
  async list() {
    let categoria;
    categoria = await sql`SELECT * FROM categoria ORDER BY id ASC`;

    return categoria;
  }

  //Metodo de criacao de categoria
  async create(categoria) {
    const { nome } = categoria;
    await sql`
      INSERT INTO categoria (nome) 
      VALUES (${nome}`;
  }
  //Metodo de actualizacao de categoria
  async update(id, categoria) {
    const { nome } = categoria;
    await sql`
      UPDATE categoria 
      SET nome = ${nome} 
      WHERE id = ${id}`;
  }
  //Metodo de exclusao de categoria
  async delete(id) {
    await sql`DELETE FROM categoria WHERE id = ${id}`;
  }
}
