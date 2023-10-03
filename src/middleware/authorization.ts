import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserData } from "@appTypes/UserData";
import ErrorService from "@appTypes/Error";



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
            const response: ResBody<{}> = {
                message: "Acceso no autorizado",
                data: {}
            };
            res.status(403).json(response);
            return
        }
        jwt.verify(token, 'getkeyfromenv', function (params: VerifyErrors | null, decoded: JwtPayload | undefined | string | UserData) {

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
}
