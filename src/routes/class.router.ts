import express from "express";
import ClassController from "@controllers/class.controller";
import asyncHandler from "express-async-handler"
import AuthorizationMiddleware from "@middleware/authorization.middleware";

const classRouter = express.Router();
const classController = new ClassController();
const auth = new AuthorizationMiddleware();

classRouter.post("/create", auth.verifyProfessor.bind(auth), asyncHandler(classController.create.bind(classController)));
classRouter.post("/enroll", auth.verifyStudent.bind(auth), asyncHandler(classController.enroll.bind(classController)));
classRouter.put("/archive/:id", auth.verifyProfessor.bind(auth), asyncHandler(classController.archive.bind(classController)));
classRouter.put("/edit", auth.verifyProfessor.bind(auth), asyncHandler(classController.update.bind(classController)));
classRouter.get("/students", auth.verifyStudent.bind(auth), asyncHandler(classController.getAllByStudent.bind(classController)));
classRouter.get("/professor", auth.verifyProfessor.bind(auth), asyncHandler(classController.getAllByProfessor.bind(classController)));
classRouter.post("/users/invite", auth.verifyProfessor.bind(auth), asyncHandler(classController.getPossibleInvitations.bind(classController)));
classRouter.post("/terms/", auth.verifyProfessor.bind(auth), asyncHandler(classController.getTerms.bind(classController)));
classRouter.post("/termsCategories/", auth.verifyProfessor.bind(auth), asyncHandler(classController.getCategories.bind(classController)));
classRouter.get("/regenerateCode", auth.verifyProfessor.bind(auth), asyncHandler(classController.regenerateCode.bind(classController)));
classRouter.get("/members", asyncHandler(classController.getClassMembers.bind(classController)));
classRouter.get("/:id", asyncHandler(classController.get.bind(classController)));
classRouter.get("/", asyncHandler(classController.getAll.bind(classController)));
classRouter.delete("/:id", auth.verifyProfessor.bind(auth), asyncHandler(classController.delete.bind(classController)));

export default classRouter;