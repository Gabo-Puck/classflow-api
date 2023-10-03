import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import AuthService from "@services/authService";
import UserJwt from "@models/Credentials";
import UserService from "@services/usuarioService";
import { Prisma, User } from "@prisma/client";
import ErrorService from "@appTypes/Error";
import HashService from "@services/hashService";



export default class AuthController {
    authService = new AuthService();
    userService = new UserService();
    hashService = new HashService();
    async getToken(req: Request, res: Response, next: NextFunction) {
        console.log("XD");
        let user = req.body as Prisma.UserCreateInput;
        //extract values from body
        let { password, email } = user;
        //search user by email
        let userFound = await this.userService.getUserByEmail(email);
        //no user found validation
        if (userFound === null) {
            throw new ErrorService("No se encontro un usuario con ese correo", user, 404);
        }
        //get user found by email hashed password
        let { password: passwordFound, id, role } = userFound;
        //hash password from body
        let hashedPassword = await this.hashService.hashData(password);
        //same password validation
        if (hashedPassword !== passwordFound) {
            throw new ErrorService("La contraseña es incorrecta", user, 403);
        }
        //user verified, generate token
        let token = await this.authService.getToken({
            id,
            role
        })
        res.status(200).json(token);
        return;
    }
    // async getToken(req: Request, res: Response, next: NextFunction) {
    //     let credentials = req.body as UserJwt;
    //     const response = await this.authService.getToken(credentials);
    //     res.status(200).json(response);
    // }
}
