import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { ClassModel } from "@models/index";
import { prisma } from "@libs/prisma"
import { DefaultArgs } from "@prisma/client/runtime/library";
import GroupService from "./groups.service";
import { DEFAULT_GROUP_NAME } from "@appTypes/DefaultGroup";
import { GROUP_ROLES } from "@appTypes/GroupRoles";
import { EnrollmentStatus } from "@appTypes/EnrollmentTypes";
import GeneralService from "./general.service";


export default class ClassService {
    groupService = new GroupService();
    generalService = new GeneralService();
    public async createClass(classPayload: ClassModel, idUser: number) {
        //search for classPayload with the required email

        let foundClass = await prisma.class.findFirst({
            where: {
                name: classPayload.name,
                creatorId: idUser,
                AND: {
                    archived: false,
                    deleted: false,
                }
            }
        });

        //found validation
        if (foundClass !== null) {
            throw new ErrorService(
                "Ya tienes una clase con ese nombre",
                classPayload,
                400
            );
        }
        classPayload.creatorId = idUser;
        //parse user input to prisma inseriton obj
        let code = await this.createClassCode();
        let insertClass = {
            ...classPayload,
            code,
            terms: {
                create: classPayload.terms.map(value => ({
                    ...value,
                    termCategories: { create: value.termCategories }
                }))
            }
        }
        // insertTemplate.termDetails.create[0].
        let createdClass = await prisma.class.create({
            data: insertClass,
            include: {
                terms: {
                    include: {
                        termCategories: true
                    }
                }
            }
        })
        let group = await this.groupService.createGroup({
            classId: createdClass.id,
            name: DEFAULT_GROUP_NAME,
            GroupDetails: [{
                groupRole: GROUP_ROLES.PROFESSOR,
                userId: idUser,
            }]
        })
        console.log({ group });
        return createdClass;
    }
    public async deleteClass(id: number): Promise<Partial<ClassModel>> {
        await this.getClassDetails(id);
        const result = await prisma.class.update({
            data: {
                deleted: true,
                deletedAt: new Date()
            },
            where: {
                id: id
            }
        });
        return result;
    }

    public async archiveClass(id: number) {
        await this.getClassDetails(id);
        const result = await prisma.class.update({
            data: {
                archived: true
            },
            where: {
                id
            }
        });
        return result;
    }
    public async updateClass(classPayload: ClassModel, idUser: number): Promise<Partial<ClassModel>> {
        let foundTemplate = await prisma.class.findFirst({
            where: {
                name: classPayload.name,
                creatorId: idUser,
                id: {
                    not: classPayload.id
                }
            }
        });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe una clase con ese nombre",
                classPayload,
                400
            );
        }
        classPayload.creatorId = idUser;
        // insertTemplate.termDetails.create[0].
        await this.getClassDetails(classPayload.id);
        let updatedTemplate = await prisma.class.update({
            data: {
                name: classPayload.name,
                description: classPayload.description
            },
            where: {
                id: classPayload.id
            }
        })

        return updatedTemplate;
    }

    public async getClassesByProfessor(idUser: number) {
        const result = await prisma.class.findMany({
            where: {
                creatorId: idUser,
                AND: {
                    archived: false,
                    deleted: false,
                }
            },
            include: {
                _count: {
                    select: {
                        enrolledStudents: true,

                    }
                }
            }
        });
        return result;
    }
    public async getClassesByStudent(idUser: number) {
        const result = await prisma.class.findMany({
            where: {
                enrolledStudents: {
                    some: {
                        studentId: idUser
                    }
                },
                AND: {
                    archived: false,
                    deleted: false,
                }
            },
            include: {
                professor: {
                    select: {
                        name: true,
                        lastname: true,
                        profilePic: true
                    }
                },
                _count: {
                    select: {
                        enrolledStudents: true
                    }
                }
            }
        });
        return result;
    }
    public async getClassDetails(id: number) {
        try {
            const result = await prisma.class.findFirstOrThrow({
                where: {
                    id,
                    AND: {
                        archived: false,
                        deleted: false,
                    }
                }
            });
            return result;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro la clase",
                    { id },
                    404
                )
            }
            throw error;
        }
    }

    public async isInClassStudent(classId: number, idUser: number) {
        try {
            //either be an student enrolled in class or the profesor
            const result = await prisma.classEnrollment.findFirstOrThrow({
                where: {
                    studentId: idUser,
                    classId,
                    status: EnrollmentStatus.ENROLLED,
                }
            });
            console.log({ result });
            return true;
        } catch (error: any) {
            if (error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
    public async isInClassProfessor(classId: number, idUser: number) {
        try {
            //either be an student enrolled in class or the profesor
            const result = await prisma.class.findFirstOrThrow({
                where: {
                    creatorId: idUser,
                    id: classId,
                    archived: false,
                    deleted: false
                }
            });
            console.log({ result });
            return true;
        } catch (error: any) {
            if (error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
    public async getAllClasses() {
        const result = await prisma.class.findMany();
        return result;
    }

    public async getClassByCode(code: string) {
        const result = await prisma.class.findFirst({
            where: {
                code,
                archived: false,
                deleted: false
            }
        });
        return result;
    }

    public async regenarateCode(classId: number) {
        let code = await this.createClassCode();
        const result = await prisma.class.update({
            where: {
                id: classId,
            },
            data: {
                code
            }
        })
        return result;
    }

    public async createClassCode(): Promise<string> {
        let code = await this.generalService.generateCode(6);
        let classFound = await this.getClassByCode(code);
        if (classFound)
            return await this.createClassCode();
        return code;
    }
}