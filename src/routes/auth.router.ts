import express from "express";
import AuthController from "@controllers/auth.controller";
import VerifyToken from "@middleware/authorization.middleware";
import asyncHandler from "express-async-handler"
import AuthorizationMiddleware from "@middleware/authorization.middleware";

const authRouter = express.Router();
const authController = new AuthController();
const authMiddleware = new AuthorizationMiddleware();
authRouter.post("/", asyncHandler(authController.getTokenUser.bind(authController)))
authRouter.post("/class", asyncHandler(authMiddleware.verifyToken.bind(authController)), asyncHandler(authController.getTokenClass.bind(authController)))

export default authRouter;