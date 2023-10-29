import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserData } from "@appTypes/UserData";
import ErrorService from "@appTypes/Error";
import { JWT_SECRET } from "@env";
import { ROLES } from "@appTypes/Roles";
import UserService from "@services/user.service";
import { Prisma, PrismaClient } from "@prisma/client";



export default class AuthorizationMiddleware {
   

    getToken(req: Request, res: Response, next: NextFunction) {
        const cookieBearer = req.cookies["access_token"]
        console.log({ cookieBearer });
        if (cookieBearer !== undefined) {
            const bearer = cookieBearer.split(' ');
            console.log({bearer});
            const jwt = bearer[1];
            req.token = jwt;
        }
        next();
    }
    
    verifyToken(req: Request, res: Response, next: NextFunction) {
        const { token } = req;
        console.log({ token });
        if (token === undefined) {
            throw new ErrorService("No se encontro el token", {}, 401);
        }
        jwt.verify(token, JWT_SECRET, function (params: VerifyErrors | null, decoded: JwtPayload | undefined | string | UserData) {

            if (params !== null) {
                console.log(params);
                throw new ErrorService("Ha ocurrido un error en la decodificación del token", params, 403);
            }
            if (decoded !== undefined) {
                req.userData = decoded as UserData;
            }
            next();
        });
    }
    verifyProfessor(req: Request, res: Response, next: NextFunction) {
        const { userData: { role } } = req;
        if (!role || role !== ROLES.PROFESSOR) {
            const response: ResBody<{}> = {
                message: "No tienes los permisos suficientes para este recurso",
                data: {
                    role: ROLES.PROFESSOR
                }
            };
            res.status(405).json(response);
            return
        }
        next();

    }
    verifyStudent(req: Request, res: Response, next: NextFunction) {
        const { userData: { role } } = req;
        if (!role || role !== ROLES.STUDENT) {
            const response: ResBody<{}> = {
                message: "No tienes los permisos suficientes para este recurso",
                data: {
                    role: ROLES.STUDENT
                }
            };
            res.status(405).json(response);
            return
        }
        next();
    }



}
