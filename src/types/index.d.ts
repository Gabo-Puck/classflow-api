import express from 'express';
import { UserData } from './UserData';


declare global {
    namespace Express {
        export interface Request {
            token?: string
            userData: UserData
        }
        export interface Response {
            token?: string
        }
    }
}
