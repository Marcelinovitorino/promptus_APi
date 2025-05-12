const { sql } = require('./db');

sql`
CREATE TABLE imagem (
    id SERIAL PRIMARY KEY,
    url VARCHAR(100) NOT NULL,
    tipo_entidade VARCHAR(20) CHECK (tipo_entidade IN ('imovel', 'terreno')),
    referencia_id INT NOT NULL
);
`
  .then(() => {
    console.log("Tabela 'imagem' criada com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao criar tabela:", err);
  });
