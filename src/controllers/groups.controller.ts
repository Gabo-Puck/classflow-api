
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import GroupsService from "@services/groups.service";

export default class GroupsController {
    groupsService = new GroupsService();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { body } = req;
        const grupo = await this.groupsService.createGroup(body);
        const response: ResBody<any> = {
            message: "Grupo creado correctamente",
            data: grupo
        }
        res.status(200).json(response);
        return
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let { query } = req.body;
        let { userData: { classId } } = req;
        const usuarios = await this.groupsService.getAllTemplates(query as string, classId as number);
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
        const grupo = await this.groupsService.getGroupsDetails(Number(id));
        response = {
            message: "",
            data: grupo
        }
        res.status(200).json(response);
        return

    }
    public async getAllByUser(req: Request, res: Response, next: NextFunction) {
        let { userData: { id }, params: { idClass } } = req;
        let response: ResBody<any>;
        const grupo = await this.groupsService.getGroupsByUser(Number(idClass), Number(id));
        response = {
            message: "",
            data: grupo
        }
        res.status(200).json(response);
        return

    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { body } = req;
        const grupo = await this.groupsService.updateGroup(body);
        const response: ResBody<any> = {
            message: "Grupo actualizado correctamente",
            data: grupo
        }
        res.status(200).json(response);
        return
    }
    public async archive(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;

        const grupo = await this.groupsService.archiveGroup(Number(id));
        response = {
            message: "Grupo archivado correctamente",
            data: grupo
        }
        res.status(200).json(response);
        return
    }
}
