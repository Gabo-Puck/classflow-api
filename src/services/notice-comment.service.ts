import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { Notice } from "@models/index";
import { prisma } from "@libs/prisma"
import { NoticeComment } from "@models/NoticeComment";


export default class NoticeCommentService {
    public async createNoticeComment(notice: NoticeComment, noticeId: number | undefined, idUser: number): Promise<NoticeComment> {
        notice.userId = idUser;

        if (noticeId === undefined)
            throw new ErrorService("El numero de anuncio es requerido", {}, 400)
        notice.noticeId = noticeId;
        let createdNotice = await prisma.noticeComment.create({
            data: {
                ...notice,
                id: undefined,
            }
        })

        return createdNotice;
    }
    public async deleteNoticeComment(id: number): Promise<Partial<NoticeComment>> {
        const result = await prisma.noticeComment.update({
            data: {
                deleted: true
            },
            where: {
                id: id
            }
        });
        return result;
    }
    public async updateNoticeComment(noticeComment: NoticeComment, idUser: number): Promise<Partial<NoticeComment>> {
        noticeComment.userId = idUser;

        let updatedNotice = await prisma.noticeComment.update({
            data: noticeComment,
            where: {
                id: noticeComment.id
            }
        })

        return updatedNotice;
    }

    public async getCommentsByNotice(noticeId: number | undefined) {
        if (!noticeId)
            throw new ErrorService("El id de anuncio es necesario", {}, 400)
        const result = await prisma.noticeComment.findMany({
            where: {
                noticeId,
                deleted: false
            }
        });
        return result;
    }
    public async getNoticeCommentDetails(noticeCommentId: number | undefined) {
        if (!noticeCommentId)
            throw new ErrorService("El id de clase es necesario", {}, 400)
        try {
            const result = await prisma.noticeComment.findFirstOrThrow({
                where: {
                    id: noticeCommentId,
                    deleted: false
                }
            });
            return result;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro el comentario",
                    { noticeId: noticeCommentId },
                    404
                )
            }
            throw error;
        }
    }
}