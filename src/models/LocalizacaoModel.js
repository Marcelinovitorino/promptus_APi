import { sql } from './db';

sql`
CREATE TABLE localizacao (
    id SERIAL PRIMARY KEY,
    endereco VARCHAR(45),
    cidade VARCHAR(45)
);

`
.then(() => {
    console.log("Tabela 'Localizacao' criada com sucesso.");
})
.catch((err) => {
    console.error("Erro ao criar tabela:", err);
});
