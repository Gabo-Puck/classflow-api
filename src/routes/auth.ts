import express from "express";
import AuthController from "../controllers/authController";
import VerifyToken from "../middleware/authorization";
import Credentials from "../models/Credentials";
import ResBody from "../types/Response";

const authRouter = express.Router();
const authController = new AuthController();
const authMiddleware = new VerifyToken();
authRouter.post("/", authController.getToken)

authRouter.get("/profile", authMiddleware.verifyToken, authController.showToken)

export default authRouter;