
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import AssignmentService from "@services/assignment.service";
import FileService from "@services/file.service";


export const CREATE = "create";
export const DELETE = "delete";

export default class AssignmentController {
    assignmentService = new AssignmentService();
    fileService = new FileService();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { classId } } = req;
        const usuario = await this.assignmentService.create(body, classId as number);
        const response: ResBody<any> = {
            message: "Usuario creado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let { email, name } = req.body;
        let { userData: { classId, id } } = req;
        const usuarios = await this.assignmentService.getAllAssignments(classId as number, id);
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
        const assignment = await this.assignmentService.getAssignmentDetails(Number(id));
        response = {
            message: "",
            data: assignment
        }
        res.status(200).json(response);
        return
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;

        const usuario = await this.assignmentService.updateAssignment(body, id);
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

        const usuario = await this.assignmentService.deleteTemplate(Number(id));
        response = {
            message: "Usuario eliminado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async mark(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let { state } = req.query;
        let { userData } = req;
        let { base } = req.body;
        let response: ResBody<any>;
        await this.fileService.saveBase64ToFileAsync(base, "canela");
        const usuario = await this.assignmentService.markComplete(Number(id), userData.id, Boolean(state));
        response = {
            message: "Estatus de tarea actualizado",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
}
