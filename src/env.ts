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
//domain where the frontend is hosted
export const DOMAIN = loadEnvValue("DOMAIN");
export const RESEND_KEY = loadEnvValue("RESEND_KEY");
//credentials for email system
export const CLASSFLOW_GMAIL_PASSWORD = loadEnvValue("CLASSFLOW_GMAIL_PASSWORD");
export const CLASSFLOW_GMAIL_USER = loadEnvValue("CLASSFLOW_GMAIL_USER");
//Host where the frontend is hosted
export const CLASSFLOW_HOST_FRONTEND = `${loadEnvValue("CLASSFLOW_HOST_FRONTEND")}`;
