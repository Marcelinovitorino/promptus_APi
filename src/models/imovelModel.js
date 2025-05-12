const { sql } = require('./db');

sql`
CREATE TABLE imovel (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(45),
    descricao VARCHAR(255),
    preco DECIMAL(10,2),
    area VARCHAR(45),
    quartos INT,
    banheiros INT,
    status VARCHAR(30),
    categoria_id INT REFERENCES categoria(id),
    localizacao_id INT REFERENCES localizacao(id)
);
`
  .then(() => {
    console.log("Tabela 'imovel' criada com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao criar tabela:", err);
  });
