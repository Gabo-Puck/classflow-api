import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { Group, GroupCreate } from "@models/index";
import { prisma } from "@libs/prisma"


export default class GroupService {
    hashService = new HashService();
    public async createGroup(group: GroupCreate): Promise<Group> {
        //search for group with the required email

        let foundGroup = await prisma.group.findFirst({
            where: {
                name: group.name,
                classId: group.classId
            }
        });

        //found validation
        if (foundGroup !== null) {
            throw new ErrorService(
                "Ya existe un grupo con ese nombre en esta clase",
                group,
                400
            );
        }
        //parse user input to prisma obj
        let insertGroup = {
            ...group,
            GroupDetails: {
                create: group.GroupDetails
            }
        }

        // insertTemplate.termDetails.create[0].
        let createdTemplate = await prisma.group.create({
            data: insertGroup,
            include: {
                GroupDetails: {
                    include: {
                        user: true
                    }
                }
            }
        })
        //hash the password before creating user

        return createdTemplate;
    }
    public async updateGroup(group: Group): Promise<Partial<Group>> {
        let foundTemplate = await prisma.group.findFirst({
            where: {
                name: group.name,
                classId: group.classId,
                id: {
                    not: group.id
                }
            }
        });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe un grupo con ese nombre en esta clase",
                group,
                400
            );
        }
        let { id, ...updateTemplate } = group;
        //parse user input to prisma obj
        let updateRequest = {
            ...updateTemplate,
            GroupDetails: {
                create: group.GroupDetails
            }
        }

        // insertTemplate.termDetails.create[0].
        //delete relations
        let res = await prisma.group.update({
            data: {
                GroupDetails: {
                    deleteMany: {
                    }
                }
            },
            where: {
                id: group.id
            }
        });
        console.log({ res });
        let updatedTemplate = await prisma.group.update({
            data: updateRequest,
            include: {
                GroupDetails: {
                    include: {
                        user: true
                    }
                }
            },
            where: {
                id: group.id
            }
        })
        return updatedTemplate;
    }

    public async getGroupsByUser(idClass: number, idUser: number) {
        const result = await prisma.group.findMany({
            where: {
                classId: idClass,
                GroupDetails: {
                    every: {
                        userId: idUser
                    }
                }
            }
        });
        return result;
    }
    public async archiveGroup(idGroup: number) {
        const result = await prisma.group.update({
            data: {
                archived: true
            },
            where: {
                id: idGroup
            }
        });
        return result;
    }
    public async getGroupsDetails(id: number) {
        try {
            const result = await prisma.group.findFirstOrThrow({
                where: {
                    id
                },
                include: {
                    GroupDetails: {
                        include: {
                            user: true
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
    public async getAllTemplates(query: string, classId: number) {
        const result = await prisma.group.findMany({
            where: {
                name: {
                    contains: query
                },
                classId
            }
        });
        return result;
    }
}