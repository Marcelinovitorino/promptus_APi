import { Router } from "express";
import multer from "multer";
import path from "path";

import { DatabasePostgress } from "../models/database-Postgress.js";
import multerConfig from "../config/multerConfig.js";

const routes = Router();
const database = new DatabasePostgress();
const upload = multerConfig;

// Listar usuários
routes.get("/users", async (req, res) => {

});

// Criar usuário
routes.post("/users", upload.array('images', 5), async (req, res) => {
  const { name, email } = req.body;
  const imagens = req.files?.map(file => file.filename);

});


// Atualizar usuário
routes.put("/users/:id", upload.array('images', 5), async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  const images = req.files?.map(file => file.filename);

  // Atualizar os dados do usuário (name, email)
  await database.update(id, { name, email });

  // Atualizar as images
  if (images && images.length > 0) {
    await database.update(id, images);
  }

  res.status(204).json([]);
});


// Deletar usuário
routes.delete("/users/:id", async (req, res) => {

});

// Buscar usuário por ID
routes.get("/users/:id", async (req, res) => {

});

export default routes;