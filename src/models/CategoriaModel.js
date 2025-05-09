import { sql } from './db';

sql`
   CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(45) NOT NULL
);
`
.then(() => {
    console.log("Tabela 'categoria' criada com sucesso.");
})
.catch((err) => {
    console.error("Erro ao criar tabela:", err);
});
