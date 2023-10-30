import express from "express";
import EnrollmentController from "@controllers/enrollment.controller";
import asyncHandler from "express-async-handler"
import AuthorizationMiddleware from "@middleware/authorization.middleware";

const enrollmentRouter = express.Router();
const enrollmentController = new EnrollmentController();
const auth = new AuthorizationMiddleware();

enrollmentRouter.post("/create", auth.verifyProfessor.bind(auth), asyncHandler(enrollmentController.create.bind(enrollmentController)));
enrollmentRouter.post("/enroll", auth.verifyStudent.bind(auth), asyncHandler(enrollmentController.enroll.bind(enrollmentController)));
enrollmentRouter.put("/drop", auth.verifyStudent.bind(auth), asyncHandler(enrollmentController.drop.bind(enrollmentController)));
enrollmentRouter.delete("/reject/:classId", auth.verifyStudent.bind(auth), asyncHandler(enrollmentController.delete.bind(enrollmentController)));
enrollmentRouter.get("/student", auth.verifyStudent.bind(auth), asyncHandler(enrollmentController.getStudent.bind(enrollmentController)));
enrollmentRouter.get("/class", auth.verifyProfessor.bind(auth), asyncHandler(enrollmentController.getClass.bind(enrollmentController)));

export default enrollmentRouter;