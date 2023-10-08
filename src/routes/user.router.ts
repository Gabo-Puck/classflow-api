import express from "express";
import UserController from "@controllers/user.controller";
import asyncHandler from "express-async-handler"

const usuarioRouter = express.Router();
const usuarioController = new UserController();

usuarioRouter.post("/create", asyncHandler(usuarioController.create.bind(usuarioController)));
usuarioRouter.put("/edit", asyncHandler(usuarioController.update.bind(usuarioController)));
usuarioRouter.delete("/:id", asyncHandler(usuarioController.delete.bind(usuarioController)));
usuarioRouter.get("/:id", asyncHandler(usuarioController.get.bind(usuarioController)));
usuarioRouter.get("/", asyncHandler(usuarioController.getAll.bind(usuarioController)));

export default usuarioRouter;