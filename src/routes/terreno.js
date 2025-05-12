const express = require('express');
const terrenoController = require('../controllers/terrenoController');
const multerConfig = require("../config/multerConfig");

const routes = express.Router();
const database = new terrenoController()
const { upload, handleMulterError } = require('../config/multerConfig');


// Middleware de tratamento de erros
const handleErrors = (res, error, action) => {
  console.error(`Erro ao ${action} terreno:`, error);
  res.status(500).json({ error: `Erro interno no servidor ao ${action} terreno` });
};

// Listar todos os terrenos
routes.get("/terrenos", async (req, res) => {
  try {
    const terrenos = await database.list();
    res.json(terrenos);
  } catch (error) {
    handleErrors(res, error, "buscar");
  }
});

// Obter um terreno específico
routes.get("/terrenos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const terreno = await database.findById(id);
    
    if (terreno) {
      res.json(terreno);
    } else {
      res.status(404).json({ message: "Terreno não encontrado" });
    }
  } catch (error) {
    handleErrors(res, error, "buscar");
  }
});

// Criar novo terreno
routes.post("/terrenos", upload.array('imagens', 5),handleMulterError, async (req, res) => {
  try {
    const { titulo, descricao, preco, area, localizacao } = req.body;
    const imagens = req.files?.map(file => file.path) || []; 

    const novoTerreno = await database.create({
      titulo,
      descricao,
      preco,
      area,
      localizacao_id: localizacao,
      imagens
    });

    res.status(201).json({
      message: "Terreno criado com sucesso!",
      terreno: novoTerreno
    });
  } catch (error) {
    handleErrors(res, error, "criar");
  }
});

// Atualizar terreno
routes.put("/terrenos/:id", upload.array('imagens', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, preco, area, localizacao_id } = req.body;
    const imagens = req.files?.map(file => file.filename) || [];

    const terrenoAtualizado = await database.update(id, {
      titulo,
      descricao,
      preco,
      area,
      localizacao_id,
      imagens
    });

    res.status(200).json({ 
      message: "Terreno atualizado com sucesso!", 
      terreno: terrenoAtualizado 
    });
  } catch (error) {
    handleErrors(res, error, "atualizar");
  }
});

// Deletar terreno
routes.delete("/terrenos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const terrenoExistente = await database.findById(id);
    
    if (!terrenoExistente) {
      return res.status(404).json({ message: "Terreno não encontrado" });
    }

    const deletado = await database.delete(id);
    
    if (deletado) {
      res.status(200).json({ 
        message: "Terreno deletado com sucesso!",
        id: id
      });
    } else {
      res.status(500).json({ message: "Falha ao deletar terreno" });
    }
  } catch (error) {
    handleErrors(res, error, "deletar");
  }
});

module.exports = routes;