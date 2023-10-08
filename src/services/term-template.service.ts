import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { TermTemplate } from "@models/index";
import { prisma } from "@libs/prisma"


export default class TermTemplateService {
    hashService = new HashService();
    public async createTemplate(template: TermTemplate, idUser: number): Promise<TermTemplate> {
        //search for template with the required email

        let foundTemplate = await prisma.termTemplate.findFirst({
            where: {
                name: template.name,
                creatorId: idUser
            }
        });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe una plantilla de parcial con ese nombre",
                template,
                400
            );
        }
        template.creatorId = idUser;
        //parse user input to prisma obj
        let insertTemplate = {
            ...template,
            termDetails: {
                create: template.termDetails.map((value) => ({
                    ...value,
                    termTemplateDetailsCategories: {
                        create: value.termTemplateDetailsCategories.map((value2) => (value2))
                    }
                }))
            }
        }

        // insertTemplate.termDetails.create[0].
        let createdTemplate = await prisma.termTemplate.create({
            data: insertTemplate,
            include: {
                termDetails: {
                    include: {
                        termTemplateDetailsCategories: true
                    }
                }
            }
        })
        //hash the password before creating user

        return createdTemplate;
    }
    public async deleteTemplate(id: number): Promise<Partial<TermTemplate>> {
        const result = await prisma.termTemplate.delete({
            where: {
                id: id
            }
        });
        return result;
    }
    public async updateTemplate(template: TermTemplate, idUser: number): Promise<Partial<TermTemplate>> {
        let foundTemplate = await prisma.termTemplate.findFirst({
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
                "Ya existe una plantilla de parcial con ese nombre",
                template,
                400
            );
        }
        template.creatorId = idUser;
        let { id, ...updateTemplate } = template;
        //parse user input to prisma obj
        let updateRequest = {
            ...updateTemplate,
            termDetails: {
                create: template.termDetails.map((value) => ({
                    ...value,
                    termTemplateDetailsCategories: {
                        create: value.termTemplateDetailsCategories.map((value2) => (value2))
                    }
                }))
            }
        }

        // insertTemplate.termDetails.create[0].
        //delete relations
        let res = await prisma.termTemplate.update({
            data: {
                termDetails: {
                    deleteMany: {
                    }
                }
            },
            where: {
                id: template.id
            }
        });
        console.log({ res });
        let updatedTemplate = await prisma.termTemplate.update({
            data: updateRequest,
            include: {
                termDetails: {
                    include: {
                        termTemplateDetailsCategories: true
                    }
                }
            },
            where: {
                id: template.id
            }
        })
        //hash the password before creating user

        return updatedTemplate;
    }

    public async getTemplatesByUser(idUser: number) {
        const result = await prisma.termTemplate.findMany({
            where: {
                creatorId: idUser
            }
        });
        return result;
    }
    public async getTermTemplatesDetails(id: number) {
        try {
            const result = await prisma.termTemplate.findFirstOrThrow({
                where: {
                    id
                },
                include: {
                    termDetails: {
                        include: {
                            termTemplateDetailsCategories: true
                        }
                    }
                }
            });
            return result;
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
    public async getAllTemplates() {
        const result = await prisma.termTemplate.findMany();
        return result;
    }
}