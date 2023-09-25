import express from "express";
import UsuarioController from "../controllers/usuarioController";
const usuarioRouter = express.Router();
const usuarioController = new UsuarioController();

usuarioRouter.post("/crear", usuarioController.create.bind(usuarioController));
usuarioRouter.put("/editar", usuarioController.update.bind(usuarioController));
usuarioRouter.delete("/:id", usuarioController.delete.bind(usuarioController));
usuarioRouter.get("/:id", usuarioController.get.bind(usuarioController));
usuarioRouter.get("/", usuarioController.getAll.bind(usuarioController));

export default usuarioRouter;