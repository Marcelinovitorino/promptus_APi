import { Router } from "express";


import { CategoriaController } from "../controllers/categoriaController.js";


const routes = Router();
const database = new DatabasePostgress();


// Listar usuários
routes.get("/categorias", async (req, res) => {

});

// Criar categoria
routes.post("/categorias", upload.array('images', 5), async (req, res) => {
  const { name, email } = req.body;
  

});


// Atualizar categoria
routes.put("/categorias/:id", async (req, res) => {
  const id = req.params.id;
  const { nome } = req.body;

});


// Deletar categoria
routes.delete("/categorias/:id", async (req, res) => {

});

// Buscar categoria por ID
routes.get("/categorias/:id", async (req, res) => {

});

export default routes;