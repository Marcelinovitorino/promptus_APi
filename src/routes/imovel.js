import { Router } from "express";
import imovelController from '../controllers/imovelController.js';
import multerConfig from "../config/multerConfig.js";

const routes = Router();
const database = new imovelController();
const upload = multerConfig;

// Listar imóveis
routes.get("/imoveis", async (req, res) => {
  try {
    const imoveis = await database.list();

    res.json(imoveis);
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


export default routes;
