import dotenv from "dotenv";
dotenv.config();
function loadEnvValue(key: string) {
    let value = process.env[key];
    if (value === undefined)
        throw new Error(`Fatal error: ${key} is missing in environment!`)
    return value;
}
export const PORT = loadEnvValue("PORT");
export const CIPHER_IV = loadEnvValue("CIPHER_IV");
export const CIPHER_SECRET = loadEnvValue("CIPHER_SECRET");
export const JWT_SECRET = loadEnvValue("JWT_SECRET");
export const ORIGINS = loadEnvValue("ORIGINS");
export const DOMAIN = loadEnvValue("DOMAIN")