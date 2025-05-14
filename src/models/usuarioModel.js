const { sql } = require('./db');

sql`
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'consultor' -- pode ser 'admin' ou 'consultor'
);
`
  .then(() => {
    console.log("Tabela 'usuarios' criada com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao criar tabela:", err);
  });
