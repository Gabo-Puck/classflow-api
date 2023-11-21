import express from "express";
import GroupController from "@controllers/groups.controller";
import asyncHandler from "express-async-handler"
import AuthorizationMiddleware from "@middleware/authorization.middleware";

const groupsRouter = express.Router();
const groupController = new GroupController();
const auth = new AuthorizationMiddleware();

groupsRouter.post("/create", auth.verifyProfessor, asyncHandler(groupController.create.bind(groupController)));
groupsRouter.put("/edit",auth.verifyProfessor, asyncHandler(groupController.update.bind(groupController)));
groupsRouter.get("/user/:idClass", asyncHandler(groupController.getAllByUser.bind(groupController)));
groupsRouter.get("/:id", asyncHandler(groupController.get.bind(groupController)));
groupsRouter.post("/", asyncHandler(groupController.getAll.bind(groupController)));
groupsRouter.post("/archive/:id", asyncHandler(groupController.archive.bind(groupController)));

export default groupsRouter;