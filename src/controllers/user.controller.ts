
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import UsuarioService from "@services/user.service";
import { Prisma } from "@prisma/client";

export default class UserController {
    usuarioService = new UsuarioService();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { body } = req;
        const usuario = await this.usuarioService.createUser(body);
        const response: ResBody<Prisma.UserUncheckedCreateInput> = {
            message: "Usuario creado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        let { token } = req.params;
        const usuarios = await this.usuarioService.verifyEmail(token);
        const response: ResBody<string> = {
            message: "Se ha activado la cuenta",
            data: ""
        }
        res.status(200).json(response);
        return
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const usuarios = await this.usuarioService.getAllUsers();
        const response: ResBody<Prisma.UserUncheckedCreateInput[]> = {
            message: "",
            data: usuarios
        }
        res.status(200).json(response);
        return
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<Prisma.UserUncheckedCreateInput>;
        const usuario = await this.usuarioService.getUserById(Number(id));
        response = {
            message: "",
            data: usuario
        }
        res.status(200).json(response);
        return

    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { body } = req.body;
        let { id } = body;

        const usuario = await this.usuarioService.updateUser(id, body);
        const response: ResBody<Prisma.UserUncheckedCreateInput> = {
            message: "Usuario actualizado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<Prisma.UserUncheckedCreateInput>;

        const usuario = await this.usuarioService.deleteUser(Number(id));
        response = {
            message: "Usuario eliminado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
}
