
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import EnrollmentService from "@services/enrollment.service";

export default class EnrollmentController {
    enrollmentService = new EnrollmentService();
    public async getStudent(req: Request, res: Response, next: NextFunction) {
        let { userData } = req;
        const classResponse = await this.enrollmentService.getInvitationsStudent(Number(userData.id));
        const response: ResBody<any> = {
            message: "Invitaciones enviadas correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async getClass(req: Request, res: Response, next: NextFunction) {
        let { userData } = req;
        const classResponse = await this.enrollmentService.getInvitationsClass(Number(userData.classId));
        const response: ResBody<any> = {
            message: "Invitaciones enviadas correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async create(req: Request, res: Response, next: NextFunction) {
        let { idUsers } = req.body;
        let { userData } = req;
        const classResponse = await this.enrollmentService.createEnrollmentBatch(Number(userData.classId), idUsers);
        const response: ResBody<any> = {
            message: "Invitaciones enviadas correctamente",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async enroll(req: Request, res: Response, next: NextFunction) {
        let { classId } = req.body;
        let { userData } = req;
        const classResponse = await this.enrollmentService.enroll(classId, userData.id as number);
        const response: ResBody<any> = {
            message: "Te has inscrito a la clase",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async drop(req: Request, res: Response, next: NextFunction) {
        let { classId } = req.body;
        let { userData } = req;
        const classResponse = await this.enrollmentService.drop(classId, userData.classId as number);
        const response: ResBody<any> = {
            message: "Te has dado de baja de la clase",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        let { classId } = req.params;
        let { userData } = req;
        const classResponse = await this.enrollmentService.reject(Number(classId), Number(userData.id));
        const response: ResBody<any> = {
            message: "Invitación",
            data: classResponse
        }
        res.status(200).json(response);
        return
    }

}
