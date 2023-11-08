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
                id: req.userData.id,
                role: req.userData.role,
                name: req.userData.name,
                lastname: req.userData.lastname,
                profilePic: req.userData.profilePic,
                email: req.userData.email
            }
        }
        res.status(200).json(response);
        return

    }
    async sendValidation(req: Request, res: Response, next: NextFunction) {

        let { email } = req.body;
        let userFound = await this.userService.getUserByEmail(email);
        //no user found validation
        if (userFound === null) {
            throw new ErrorService("No se encontro un usuario con ese correo", email, 404);
        }
        if (userFound.emailVerified) {
            throw new ErrorService("Este correo ya se encuentra validado", email, 400);
        }
        await this.userService.sendVerificationEmail(email, userFound.id);
        let response: ResBody<string> = {
            message: "Correo enviado",
            data: ""
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
        let { password: passwordFound, id, role, name, profilePic, emailVerified, lastname } = userFound;
        //hash password from body
        let hashedPassword = await this.hashService.hashData(password);
        //same password validation
        if (hashedPassword !== passwordFound) {
            throw new ErrorService("La contraseña es incorrecta", user, 403);
        }
        //email not verified yet
        if (!emailVerified) {
            throw new ErrorService("No se ha validado el correo", user, 405);
        }

        //user verified, generate token
        let token = await this.authService.getTokenAccess({
            id,
            role,
            name,
            profilePic,
            emailVerified,
            email,
            lastname
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
        if (!classId)
            throw new ErrorService("Tienes que pasar una clase como parametro", {}, 400);
        //extract values from token
        let { id: studentId } = userData;
        //check if student is enrolled in
        let isStudent = await this.classService.isInClassStudent(classId, studentId);
        let isProfessor = await this.classService.isInClassProfessor(classId, studentId);
        //no user enrolled validation
        if (!(isStudent || isProfessor)) {
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
