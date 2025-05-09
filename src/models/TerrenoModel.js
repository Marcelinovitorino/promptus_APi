import { sql } from './db';

sql`
CREATE TABLE terreno (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(45),
    descricao VARCHAR(255),
    preco DECIMAL(10,2),
    area VARCHAR(45),
    localizacao_id INT REFERENCES localizacao(id),
    corretor_id INT REFERENCES corretor(id)
);

`
.then(() => {
    console.log("Tabela 'Terreno' criada com sucesso.");
})
.catch((err) => {
    console.error("Erro ao criar tabela:", err);
});
