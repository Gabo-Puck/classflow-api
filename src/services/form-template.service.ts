import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { FormTemplate } from "@models/index";
import { prisma } from "@libs/prisma"
import GeneralService from "./general.service";
import crypto from "crypto"
import { QuestionTypes } from "@appTypes/QuestionTypes";
import Question from "@appTypes/Question";


export default class FormTemplateService {
    hashService = new HashService();
    generalService = new GeneralService();

    public async createTemplate(template: FormTemplate, idUser: number) {
        //search for template with the required email

        let foundTemplate = await prisma.formTemplate.findFirst({
            where: {
                name: template.name,
                creatorId: idUser
            }
        });

        let where = {
            name: template.name,
            creatorId: idUser
        }
        console.log({ where });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe un plantilla de formulario con ese nombre",
                template,
                400
            );
        }
        template.creatorId = idUser;


        let data = template.questions.map((m) => {
            m.id = crypto.randomUUID();
            if (m.payload.type === QuestionTypes.CLOSED || m.payload.type === QuestionTypes.MULTIPLE) {
                m.payload.data = m.payload.data.map((v) => ({ ...v, id: crypto.randomUUID() }))
            }
            return m;
        })

        let createdTemplate = await prisma.formTemplate.create({
            data: {
                ...template,
                questions: JSON.stringify(data)
            }
        })


        return createdTemplate;
    }
    public async deleteTemplate(id: number) {
        await this.getFormTemplateDetails(id);
        const result = await prisma.formTemplate.delete({
            where: {
                id: id
            }
        });
        return result;
    }
    public async updateTemplate(template: FormTemplate, idUser: number) {
        let foundTemplate = await prisma.formTemplate.findFirst({
            where: {
                name: template.name,
                creatorId: idUser,
                id: {
                    not: template.id
                }
            }
        });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe una plantilla de formulario con ese nombre",
                template,
                400
            );
        }
        template.creatorId = idUser;
        let updateTemplate = template.questions.map((m) => {
            m.id = crypto.randomUUID();
            if (m.payload.type === QuestionTypes.CLOSED || m.payload.type === QuestionTypes.MULTIPLE) {
                m.payload.data = m.payload.data.map((v) => ({ ...v, id: crypto.randomUUID() }))
            }
            return m;
        })
        //parse user input to prisma obj
        let updateRequest = {
            ...template,
            updatedAt: undefined,
            questions: JSON.stringify(updateTemplate)
        }

        let updatedTemplate = await prisma.formTemplate.update({
            data: updateRequest,
            where: {
                id: template.id
            }
        })
        //hash the password before creating user

        return updatedTemplate;
    }

    public async getFormTemplateDetails(id: number) {
        try {
            const result = await prisma.formTemplate.findFirstOrThrow({
                where: {
                    id
                }
            });
            let parsedResult: FormTemplate;
            parsedResult = {
                ...result,
                questions: JSON.parse(result.questions) as Question[]
            };
            return parsedResult;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro la plantilla",
                    { id },
                    404
                )
            }
            throw error;
        }

    }
    public async getAllTemplates(creatorId: number) {
        const result = await prisma.formTemplate.findMany({
            where: {
                creatorId
            }
        });
        return result;
    }
}