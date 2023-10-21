import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserJwt from "@models/Credentials";
import { UserData } from "@appTypes/UserData";
import { JWT_SECRET } from "@env";
import { rejects } from "assert";
export default class AuthService {
    public async getTokenAccess(credentials: UserJwt): Promise<string> {
        return new Promise((resolve, reject) => {
            //fetch userData based on credentials

            //create token from data and a secret
            jwt.sign(credentials, JWT_SECRET, (error: Error | null, token: string | undefined) => {
                if (error != null || token === undefined) {
                    reject(error)
                    return;
                }
                resolve(token);
            })
        })
    }
    /**
     * getTokenActivateAccount
     * Create a token to validate an email. Each token expires in 10 minutes
     */
    public getTokenVerifyEmail(id: number): Promise<string>{
        return new Promise((resolve, reject) => {
            jwt.sign({ id }, JWT_SECRET, { expiresIn: "10m" }, (error: Error | null, token: string | undefined) => {
                if (error != null || token === undefined) {
                    reject(error)
                    return;
                }
                resolve(token);
            })
        })
    }

    public validateVerifyEmailToken(token: string): Promise<{ id: number }> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, function (params: VerifyErrors | null, decoded: JwtPayload | undefined | string | { id: number }) {

                if (params !== null) {
                    console.log(params);
                    reject(params);
                    return;
                }
                if (decoded !== undefined) {
                    resolve(decoded as { id: number });
                    return;
                }
                reject("Something went horribly wrong");
            });
        })
    }

    public printMessage(userData: UserData): string {
        return `Hi user. We'll send a email to ${userData.name} with a cat gif ;)!`;
    }
}