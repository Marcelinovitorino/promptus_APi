const express = require('express');
const { LocalizacaoController } = require('../controllers/localizacaoController');

const routes = express.Router();
const database = new LocalizacaoController();

// Listar localização
routes.get("/localizacao", async (req, res) => {
  try {
    const localizacoes = await database.list();
    return res.json(localizacoes);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar localizacao" });
  }
});

// Criar localização
routes.post("/localizacao", async (req, res) => {
  const { endereco, cidade } = req.body;
  try {
    await database.create({ endereco, cidade });
    res.status(200).json({ message: "Localização criada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar localização" });
  }
});

// Atualizar localização
routes.put("/localizacao/:id", async (req, res) => {
  const id = req.params.id;
  const { endereco, cidade } = req.body;
  try {
    await database.update(id, { endereco, cidade });
    res.status(204).json([]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar localização" });
  }
});

// Deletar localização
routes.delete("/localizacao/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await database.delete(id);
    return res.status(204).json([]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar localização" });
  }
});

// Buscar localização por ID
routes.get("/localizacao/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const localizacao = await database.findById(id);
    if (localizacao) {
      return res.json(localizacao);
    }
    return res.status(404).json({ message: "Localização não encontrada" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar localização" });
  }
});

module.exports = routes;
