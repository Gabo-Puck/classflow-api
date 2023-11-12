import express from "express";
import FormTemplatecontroller from "@controllers/form-template.controller";
import asyncHandler from "express-async-handler"

const formTemplateRouter = express.Router();
const formController = new FormTemplatecontroller();

formTemplateRouter.post("/create", asyncHandler(formController.create.bind(formController)));
formTemplateRouter.put("/edit", asyncHandler(formController.update.bind(formController)));
formTemplateRouter.get("/:id", asyncHandler(formController.get.bind(formController)));
formTemplateRouter.get("/", asyncHandler(formController.getAll.bind(formController)));
formTemplateRouter.delete("/:id", asyncHandler(formController.delete.bind(formController)));

export default formTemplateRouter;