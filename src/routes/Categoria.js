import { Router } from "express";

import { CategoriaController } from "../controllers/categoriaController.js";

const routes = Router();
const database = new CategoriaController();

// Listar categorias
routes.get("/categorias", async (req, res) => {

  const categorias = await database.list();
  return res.json(categorias);
});

// Criar categoria
routes.post("/categorias", async (req, res) => {
  const { nome } = req.body;

  await database.create({
    nome
  });

  res.status(200).json({ message: "Categoria criada com sucesso!" });
});

// Atualizar categoria
routes.put("/categorias/:id", async (req, res) => {
  const id = req.params.id;
  const { nome } = req.body;

  await database.update(id, {
    nome,
  });

  res.status(204).json([]);
});

// Deletar categoria
routes.delete("/categorias/:id", async (req, res) => {
  const id = req.params.id;
  await database.delete(id);
  return res.status(204).json([]);
});

// Buscar categoria por ID
routes.get("/categorias/:id", async (req, res) => {
  const id = req.params.id;

  const categoria = await database.findById(id);

  if (!categoria) {
    return res.status(404).json({ message: "Categoria não encontrada." });
  }

  return res.json(categoria);
});

export default routes;
