
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import TermTemplateService from "@services/term-template.service";

export default class TermTemplateController {
    termTemplateService = new TermTemplateService();
    public async create(req: Request, res: Response, next: NextFunction) {
        console.log("object");
        let { body, userData: { id } } = req;
        const usuario = await this.termTemplateService.createTemplate(body, id);
        const response: ResBody<any> = {
            message: "Usuario creado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let { email, name } = req.body;
        const usuarios = await this.termTemplateService.getAllTemplates();
        const response: ResBody<any[]> = {
            message: "",
            data: usuarios
        }
        res.status(200).json(response);
        return
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;
        const usuario = await this.termTemplateService.getTermTemplatesDetails(Number(id));
        response = {
            message: "",
            data: usuario
        }
        res.status(200).json(response);
        return

    }
    public async getAllByUser(req: Request, res: Response, next: NextFunction) {
        let { userData: { id } } = req;
        let response: ResBody<any>;
        const usuario = await this.termTemplateService.getTemplatesByUser(Number(id));
        response = {
            message: "",
            data: usuario
        }
        res.status(200).json(response);
        return

    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;


        const usuario = await this.termTemplateService.updateTemplate(body, id);
        const response: ResBody<any> = {
            message: "Usuario actualizado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;

        const usuario = await this.termTemplateService.deleteTemplate(Number(id));
        response = {
            message: "Usuario eliminado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
}
