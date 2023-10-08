import express from "express";
import AuthController from "@controllers/auth.controller";
import VerifyToken from "@middleware/authorization.middleware";
import asyncHandler from "express-async-handler"

const authRouter = express.Router();
const authController = new AuthController();
const authMiddleware = new VerifyToken();
authRouter.post("/", asyncHandler(authController.getToken.bind(authController)))

// authRouter.get("/profile", asyncHandler(authMiddleware.verifyToken), asyncHandler(authController.showToken.bind(authController)))

export default authRouter;