import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { Notice } from "@models/index";
import { prisma } from "@libs/prisma"


export default class NoticeService {
    public async createNotice(notice: Notice, classId: number | undefined, idUser: number): Promise<Notice> {
        notice.creatorId = idUser;
        console.log({ notice });
        // delete notice.id
        if (classId === undefined)
            throw new ErrorService("El numero de clase es requerido", {}, 400)
        notice.classId = classId;
        let createdNotice = await prisma.notice.create({
            data: {
                ...notice,
                id: undefined,
            }
        })

        return createdNotice;
    }
    public async deleteNotice(id: number): Promise<Partial<Notice>> {
        const result = await prisma.notice.delete({
            where: {
                id: id
            }
        });
        return result;
    }
    public async updateNotice(notice: Notice, idUser: number): Promise<Partial<Notice>> {
        notice.creatorId = idUser;

        let updatedNotice = await prisma.notice.update({
            data: notice,
            where: {
                id: notice.id
            }
        })

        return updatedNotice;
    }

    public async getNoticesByClass(classId: number | undefined) {
        if (!classId)
            throw new ErrorService("El id de clase es necesario", {}, 400)
        const result = await prisma.notice.findMany({
            where: {
                classId
            }
        });
        return result;
    }
    public async getNoticeDetails(noticeId: number | undefined) {
        if (!noticeId)
            throw new ErrorService("El id de clase es necesario", {}, 400)
        try {
            const result = await prisma.notice.findFirstOrThrow({
                where: {
                    id: noticeId
                }
            });
            return { ...result, content: JSON.parse(result.content) };
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro la clase",
                    { noticeId },
                    404
                )
            }
            throw error;
        }
    }
}