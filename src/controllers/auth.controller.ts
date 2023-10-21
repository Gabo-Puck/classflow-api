import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import AuthService from "@services/auth.service";
import UserJwt from "@models/Credentials";
import UserService from "@services/user.service";
import { Prisma, User } from "@prisma/client";
import ErrorService from "@appTypes/Error";
import HashService from "@services/hash.service";
import ClassService from "@services/class.service";
import { DOMAIN } from "@env";
import { UserData } from "@appTypes/UserData";



export default class AuthController {
    authService = new AuthService();
    userService = new UserService();
    classService = new ClassService();
    hashService = new HashService();

    async retrieveUserData(req: Request, res: Response, next: NextFunction) {
        let response: ResBody<Partial<UserData>> = {
            message: "Datos obtenidos",
            data: {
                role: req.userData.role,
                name: req.userData.name,
                profilePic: req.userData.profilePic
            }
        }
        res.status(200).json(response);
        return

    }
    async getTokenUser(req: Request, res: Response, next: NextFunction) {
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
        let { password: passwordFound, id, role, name, profilePic } = userFound;
        //hash password from body
        let hashedPassword = await this.hashService.hashData(password);
        //same password validation
        if (hashedPassword !== passwordFound) {
            throw new ErrorService("La contraseña es incorrecta", user, 403);
        }
        //user verified, generate token
        let token = await this.authService.getTokenAccess({
            id,
            role,
            name,
            profilePic
        })
        res.cookie("access_token", `Bearer ${token}`, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: DOMAIN,
        });
        res.status(200).json(token);
        return;
    }
    async getTokenClass(req: Request, res: Response, next: NextFunction) {
        let { classId } = req.body;
        let { userData } = req;
        //extract values from token
        let { id: studentId } = userData;
        //check if student is enrolled in
        let enrolled = await this.classService.isInClass(classId, studentId);
        //no user enrolled validation
        if (!enrolled) {
            throw new ErrorService("No tienes acceso a esta clase", {}, 403);
        }
        //user verified, generate token
        let token = await this.authService.getTokenAccess({
            ...userData,
            classId: classId
        })
        res.cookie("access_token", `Bearer ${token}`, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: DOMAIN,
        });
        res.status(200).json(token);
        return;
    }
}
