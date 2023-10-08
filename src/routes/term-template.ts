import express from "express";
import termTemplateController from "@controllers/term-template-controller";
import asyncHandler from "express-async-handler"

const termTemplates = express.Router();
const termController = new termTemplateController();

termTemplates.post("/crear", asyncHandler(termController.create.bind(termController)));
termTemplates.put("/editar", asyncHandler(termController.update.bind(termController)));
termTemplates.get("/user", asyncHandler(termController.getAllByUser.bind(termController)));
termTemplates.get("/:id", asyncHandler(termController.get.bind(termController)));
termTemplates.get("/", asyncHandler(termController.getAll.bind(termController)));
termTemplates.delete("/:id", asyncHandler(termController.delete.bind(termController)));

export default termTemplates;