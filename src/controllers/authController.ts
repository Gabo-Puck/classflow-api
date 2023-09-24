
interface AuthResponse {
    token: string;
}
import { Request, Response, NextFunction } from "express";
import ResBody from "../types/Response";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import AuthService from "../services/authService";
import Credentials from "../models/Credentials";



export default class AuthController {
    authService = new AuthService();
    async showToken(req: Request, res: Response, next: NextFunction) {
        if (!req.userData) {
            req.userData = {
                email: "",
                id: 1,
                password: ""
            }
        }
        let { userData } = req;
        let response: ResBody;
        try {
            const welcomeMessage = await this.authService.printMessage(userData);
            response = {
                message: "Greetings!",
                data: welcomeMessage
            }
        } catch (error) {
            response = {
                message: "Algo ha salido mal validando tu token",
                data: error
            }
        }
        return res.status(200).json(response);
    }
    async getToken(req: Request, res: Response, next: NextFunction) {
        let credentials = req.body as Credentials;
        const response = await this.authService.getToken(credentials);
        return res.status(200).json(response);
    }
}
