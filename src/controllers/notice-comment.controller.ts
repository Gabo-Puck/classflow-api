
import { Request, Response, NextFunction } from "express";
import ResBody from "@appTypes/Response";
import { Prisma } from "@prisma/client";
import NoticeComment from "@services/notice-comment.service";

export default class NoticeCommentController {
    noticeCommentService = new NoticeComment();
    public async create(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id, classId } } = req;
        console.log({ id, classId });
        const usuario = await this.noticeCommentService.createNoticeComment(body, classId, id);
        const response: ResBody<any> = {
            message: "Aviso creado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }

    public async getByNotice(req: Request, res: Response, next: NextFunction) {
        let { noticeId } = req.params;
        const usuarios = await this.noticeCommentService.getCommentsByNotice(Number(noticeId));
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
        const usuario = await this.noticeCommentService.getNoticeCommentDetails(Number(id));
        response = {
            message: "",
            data: usuario
        }
        res.status(200).json(response);
        return

    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { body, userData: { id } } = req;


        const usuario = await this.noticeCommentService.updateNoticeComment(body, id);
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

        const usuario = await this.noticeCommentService.deleteNoticeComment(Number(id));
        response = {
            message: "Aviso eliminado correctamente",
            data: usuario
        }
        res.status(200).json(response);
        return
    }
}
