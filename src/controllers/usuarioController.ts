
import { Request, Response, NextFunction } from "express";
import ResBody from "../types/Response";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import Credentials from "../models/Credentials";
import UsuarioService from "../services/usuarioService";

export default class UsuarioController {
    usuarioService = new UsuarioService();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { email, name } = req.body;
        const usuario = await this.usuarioService.createUsuario({ email, name });
        const response: ResBody = {
            message: "Usuario creado correctamente",
            data: usuario
        }
        return res.status(200).json(response);
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let { email, name } = req.body;
        const usuarios = await this.usuarioService.getAllUsuarios();
        const response: ResBody = {
            message: "",
            data: usuarios
        }
        return res.status(200).json(response);
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody;
        try {
            const usuario = await this.usuarioService.getUsuarioById(Number(id));
            response = {
                message: "",
                data: usuario
            }
            return res.status(200).json(response);
        } catch (error) {
            response = {
                message: "No se encontro el usuario",
                data: error
            }
            return res.status(404).json(response);
        }
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { email, name, id } = req.body;
        try {
            const usuario = await this.usuarioService.updateUsuario(id, { email, name });
            const response: ResBody = {
                message: "Usuario actualizado correctamente",
                data: usuario
            }
            return res.status(200).json(response);
        } catch (error) {
            const response: ResBody = {
                message: "No se encontro el usuario",
                data: error
            }
            return res.status(404).json(response)
        }
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody;
        try {
            const usuario = await this.usuarioService.deleteUsuario(Number(id));
            response = {
                message: "Usuario eliminado correctamente",
                data: usuario
            }
            return res.status(200).json(response);

        } catch (error) {
            response = {
                message: "No se encontro el usuario",
                data: error
            }
            return res.status(404).json(response);
        }
    }
}
