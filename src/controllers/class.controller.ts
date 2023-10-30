
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import ClassService from "@services/class.service";

export default class ClassController {
    classService = new ClassService();
    public async create(req: Request, res: Response, next: NextFunction) {
        console.log("object");
        let { body, userData: { id } } = req;
        const classResponse = await this.classService.createClass(body, id);
        const response: ResBody<any> = {
            message: "Clase creada correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async enroll(req: Request, res: Response, next: NextFunction) {
        let { userData: { id }, body } = req;
        const classResponse = await this.classService.enrollStudent(id, body.code);
        const response: ResBody<any> = {
            message: "Te has inscrito a la clase",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }

    public async getPossibleInvitations(req: Request, res: Response, next: NextFunction) {
        let { userData: { id }, body } = req;
        let { email } = req.body;
        const classResponse = await this.classService.getAllUsersInvite(id,email);
        const response: ResBody<any> = {
            message: "",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let { email, name } = req.body;
        const usuarios = await this.classService.getAllClasses();
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
        const classResponse = await this.classService.getClassDetails(Number(id));
        response = {
            message: "",
            data: classResponse
        }
        res.status(200).json(response);
        return

    }
    public async archive(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;
        const classResponse = await this.classService.archiveClass(Number(id));
        response = {
            message: "Clase archivada correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return

    }

    public async getAllByProfessor(req: Request, res: Response, next: NextFunction) {
        let { userData: { id } } = req;
        let response: ResBody<any>;
        const classResponse = await this.classService.getClassesByProfessor(Number(id));
        response = {
            message: "",
            data: classResponse
        }
        res.status(200).json(response);
        return

    }
    public async getAllByStudent(req: Request, res: Response, next: NextFunction) {
        let { userData: { id } } = req;
        let response: ResBody<any>;
        const classResponse = await this.classService.getClassesByStudent(Number(id));
        response = {
            message: "",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;


        const classResponse = await this.classService.updateClass(body, id);
        const response: ResBody<any> = {
            message: "Clase actualizada correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;

        const classResponse = await this.classService.deleteClass(Number(id));
        response = {
            message: "Clase eliminada correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async regenerateCode(req: Request, res: Response, next: NextFunction) {
        let response: ResBody<any>;
        let { classId } = req.userData;
        const classResponse = await this.classService.regenarateCode(classId as number);
        response = {
            message: "Código de clase generado correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
}
