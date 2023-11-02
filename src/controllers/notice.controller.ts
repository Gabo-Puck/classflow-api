
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import NoticeService from "@services/notice.service";

export default class TermTemplateController {
    noticeService = new NoticeService();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id, classId } } = req;
        console.log({ id, classId });
        const usuario = await this.noticeService.createNotice(body, classId, id);
        const response: ResBody<any> = {
            message: "Aviso creado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async getByClass(req: Request, res: Response, next: NextFunction) {
        let { classId } = req.userData;
        const usuarios = await this.noticeService.getNoticesByClass(classId);
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
        const usuario = await this.noticeService.getNoticeDetails(Number(id));
        response = {
            message: "",
            data: usuario
        }
        res.status(200).json(response);
        return

    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;


        const usuario = await this.noticeService.updateNotice(body, id);
        const response: ResBody<any> = {
            message: "Aviso actualizado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        let response: ResBody<any>;

        const usuario = await this.noticeService.deleteNotice(Number(id));
        response = {
            message: "Aviso eliminado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
}
