import { Request, Response, NextFunction } from "express";
import ResBody from "../types/Response";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserData } from "types/UserData";



export default class AuthorizationMiddleware {
    getToken(req: Request, res: Response, next: NextFunction) {
        const bearerHeader = req.headers["authorization"];
        if (bearerHeader !== undefined) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
        }
        next();
    }
    verifyToken(req: Request, res: Response, next: NextFunction) {
        const { token } = req;

        if (token === undefined) {
            const response: ResBody = {
                message: "Acceso no autorizado",
                data: {}
            };
            return res.status(403).json(response);
        }
        jwt.verify(token, 'getkeyfromenv', function (params: VerifyErrors | null, decoded: JwtPayload | undefined | string | UserData) {

            if (params !== null) {
                console.log(params);
                const response: ResBody = {
                    message: "Ha ocurrido un error en la decodificación del token",
                    data: params
                };
                return res.status(403).json(response);
            }
            if (decoded !== undefined) {
                req.userData = decoded as UserData;
            }
            next();
        });
    }
}
