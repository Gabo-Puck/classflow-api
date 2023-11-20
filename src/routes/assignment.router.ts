import express from "express";
import Assignment from "@controllers/assignment.controller";
import asyncHandler from "express-async-handler"

const assignmentRouter = express.Router();
const formController = new Assignment();

assignmentRouter.post("/create", asyncHandler(formController.create.bind(formController)));
assignmentRouter.put("/edit", asyncHandler(formController.update.bind(formController)));
assignmentRouter.patch("/mark/:id", asyncHandler(formController.mark.bind(formController)));
assignmentRouter.get("/:id", asyncHandler(formController.get.bind(formController)));
assignmentRouter.get("/", asyncHandler(formController.getAll.bind(formController)));
assignmentRouter.delete("/:id", asyncHandler(formController.delete.bind(formController)));

export default assignmentRouter;