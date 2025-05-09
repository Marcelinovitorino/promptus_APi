import { sql } from './db';

sql`
CREATE TABLE imagem (
    id SERIAL PRIMARY KEY,
    url VARCHAR(100) NOT NULL,
    tipo_entidade VARCHAR(20) CHECK (tipo_entidade IN ('imovel', 'terreno')),
    referencia_id INT NOT NULL
    -- opcional: podemos usar CONSTRAINTs CHECK para garantir que tipo_entidade e referencia_id sejam coerentes, via aplicação
);


`
.then(() => {
    console.log("Tabela 'imagem' criada com sucesso.");
})
.catch((err) => {
    console.error("Erro ao criar tabela:", err);
});

