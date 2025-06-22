const express = require('express');
const imovelController = require('../controllers/imovelController');
const multerConfig = require("../config/multerConfig");

const routes = express.Router();
const database = new imovelController();
const { upload, handleMulterError } = require('../config/multerConfig');


// Middleware de tratamento de erros
const handleErrors = (res, error, action) => {
  console.error(`Erro ao ${action} imóvel:`, error);
  res.status(500).json({ error: `Erro interno no servidor ao ${action} imóvel` });
};

// Listar todos os imóveis
routes.get("/imoveis", async (req, res) => {
  try {
    const imoveis = await database.list();
    res.json(imoveis);
  } catch (error) {
    handleErrors(res, error, "buscar");
  }
});

//Listagem de imovel por id
routes.get('/imoveis/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const imovel = await database.findById(id);  ;

    if (!imovel) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }

    res.json(imovel);
  } catch (error) {
    console.error('Erro ao buscar imóvel por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar novo imóvel
routes.post("/imoveis", upload.array('imagens', 5),handleMulterError, async (req, res) => {
  try {
    const { titulo, descricao, preco, area, quartos, banheiros, status, categoria, localizacao } = req.body;
    const imagens = req.files?.map(file => file.path) || []; 

    const novoImovel = await database.create({
      titulo,
      descricao,
      preco,
      area,
      quartos,
      banheiros,
      status,
      categoria_id: categoria,
      localizacao_id: localizacao,
      imagens
    });

    res.status(201).json({
      message: "Imóvel criado com sucesso!",
      imovel: novoImovel
    });
  } catch (error) {
    handleErrors(res, error, "criar");
  }
});

// Atualizar imóvel
routes.put("/imoveis/:id", upload.array('imagens', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, preco, area, quartos, banheiros, status, categoria_id, localizacao_id } = req.body;
    const imagens = req.files?.map(file => file.filename) || [];

    const imovelAtualizado = await database.update(id, {
      titulo,
      descricao,
      preco,
      area,
      quartos,
      banheiros,
      status,
      categoria_id,
      localizacao_id,
      imagens
    });

    res.status(200).json({ 
      message: "Imóvel atualizado com sucesso!", 
      imovel: imovelAtualizado 
    });
  } catch (error) {
    handleErrors(res, error, "atualizar");
  }
});
//
routes.delete("/imoveis/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o imóvel existe antes de deletar
    const imovelExistente = await database.findById(id);
    if (!imovelExistente) {
      return res.status(404).json({ message: "Imóvel não encontrado" });
    }

    // Deleta o imóvel e suas imagens associadas
    const deletado = await database.delete(id);
    
    if (deletado) {
      res.status(200).json({ 
        message: "Imóvel deletado com sucesso!",
        id: id
      });
    } else {
      res.status(500).json({ message: "Falha ao deletar imóvel" });
    }
  } catch (error) {
    handleErrors(res, error, "deletar");
  }
});
module.exports = routes;