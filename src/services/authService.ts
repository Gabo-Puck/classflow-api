import jwt from "jsonwebtoken";
import UserJwt from "@models/Credentials";
import { UserData } from "@appTypes/UserData";
export default class AuthService {
    public async getToken(credentials: UserJwt): Promise<string> {
        return new Promise((resolve, reject) => {
            //fetch userData based on credentials

            //create token from data and a secret
            jwt.sign(credentials, 'getkeyfromenv', (error: Error | null, token: string | undefined) => {
                if (error != null || token === undefined) {
                    reject(error)
                    return;
                }
                resolve(token);
            })
        })
    }
    public printMessage(userData: UserData): string {
        return `Hi user. We'll send a email to ${userData.email} with a cat gif ;)!`;
    }
}