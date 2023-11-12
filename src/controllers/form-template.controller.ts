
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import FormTemplateService from "@services/form-template.service";

export default class FormTemplateController {
    formTemplateService = new FormTemplateService();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;
        const template = await this.formTemplateService.createTemplate(body, id);
        const response: ResBody<any> = {
            message: "Plantilla de formulario creada correctamente",
            data: template
        }
        res.status(200).json(response);
        return
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let { id } = req.userData;
        const templates = await this.formTemplateService.getAllTemplates(id);
        const response: ResBody<any[]> = {
            message: "",
            data: templates
        }
        res.status(200).json(response);
        return
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;
        const template = await this.formTemplateService.getFormTemplateDetails(Number(id));
        response = {
            message: "",
            data: template
        }
        res.status(200).json(response);
        return

    }

    public async update(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;


        const usuario = await this.formTemplateService.updateTemplate(body, id);
        const response: ResBody<any> = {
            message: "Plantilla de formulario actualizado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;

        const usuario = await this.formTemplateService.deleteTemplate(Number(id));
        response = {
            message: "Plantilla de formulario eliminado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
}
