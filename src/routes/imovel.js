const express = require('express');
const imovelController  = require('../controllers/imovelController');
const multerConfig = require("../config/multerConfig")


const routes = express.Router();
const database = new imovelController();
const upload = multerConfig;

routes.get("/imoveis", async (req, res) => {
  try {
    const imoveis = await database.list();

    res.json(imoveis);
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
})
//
routes.post("/imoveis", upload.array('imagens', 5), async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      preco,
      area,
      quartos,
      banheiros,
      status,
      categoria,
      localizacao
    } = req.body;

    const imagens = req.files?.map(file => file.filename);

    // Criar o imóvel no banco de dados
    const novoImovel = await database.create({
      titulo,
      descricao,
      preco,
      area,
      quartos,
      banheiros,
      status,
      categoria_id: categoria,        // se a coluna for categoria_id
      localizacao_id: localizacao,    // se a coluna for localizacao_id
      imagens
    });

    res.status(201).json({
      message: "Imóvel criado com sucesso!",
      imovel: novoImovel
    });

  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    res.status(500).json({ message: "Erro ao criar imóvel" });
  }
});


module.exports = routes;
