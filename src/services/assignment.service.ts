import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import { FormTemplate } from "@models/index";
import { prisma } from "@libs/prisma"
import GeneralService from "./general.service";
import crypto from "crypto"
import { QuestionTypes } from "@appTypes/QuestionTypes";
import Question from "@appTypes/Question";
import { Assignment, AssingmentCreate } from "@models/Assignment";
import { assign } from "nodemailer/lib/shared";
import { Decimal } from "@prisma/client/runtime/library";
import FileService from "./file.service";
import { CREATE, DELETE } from "@controllers/assignment.controller";
export default class AssignmentService {
    generalService = new GeneralService();
    fileService = new FileService();
    public async create(assignment: AssingmentCreate, classId: number) {
        //search for template with the required email
        // let x: AssingmentCreate = 
        let foundTemplate = await prisma.assignment.findFirst({
            where: {
                title: assignment.title,
                classId: classId
            }
        });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe una clase con ese nombre",
                assignment,
                400
            );
        }
        let { form, files, ...body } = { ...assignment };
        assignment.classId = classId;
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let type = element.type;
            if (element.type == CREATE) {
                type
                await this.fileService.save(element.filename, element.base64, "storage/assignment")
            }
            if (element.type == DELETE) {
                this.fileService.delete(element.id)
            }
        }
        let createdTemplate = await prisma.assignment.create({
            data: {
                ...body,
                form: !form ? undefined : {
                    create: {
                        ...form
                    }
                }
            }
        })


        return createdTemplate;
    }

    public async deleteTemplate(id: number) {
        await this.getAssignmentDetails(id);
        const result = await prisma.assignment.delete({
            where: {
                id: id
            },
            include: {
                Deliverable: {
                    include: {
                        AnswerDeliverable: true,
                        FileDeliverable: true,
                        NoteDeliverable: true
                    }
                }
            }
        });
        return result;

    }
    public async markComplete(id: number, studentId: number, state: boolean) {
        await this.getAssignmentDetails(id);
        const result = await prisma.assignment.update({
            data: {
                Deliverable: {
                    upsert: {
                        create: {
                            delivered: state,
                            id: studentId,
                            studentId,
                            deliveredAt: new Date()
                        },
                        update: {
                            delivered: state,
                            id: studentId,
                            studentId,
                            deliveredAt: new Date()
                        },
                        where: {
                            id: studentId,
                            studentId
                        }
                    }
                }
            },
            where: {
                id
            }
        });
        return result;
    }

    public async updateAssignment(assignment: Assignment, classId: number) {
        let foundTemplate = await prisma.assignment.findFirst({
            where: {
                title: assignment.title,
                id: {
                    not: assignment.id
                }
            }
        });

        //found validation
        if (foundTemplate !== null) {
            throw new ErrorService(
                "Ya existe una plantilla de formulario con ese nombre",
                assignment,
                400
            );
        }
        //parse user input to prisma obj
        let { form, files, ...body } = { ...assignment };
        assignment.classId = classId;
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let type = element.type;
            if (element.type == CREATE) {
                type
                await this.fileService.save(element.filename, element.base64, "storage/assignment")
            }
            if (element.type == DELETE) {
                this.fileService.delete(element.id)
            }
        }
        let formOp = undefined;
        if (form !== undefined) {
            //update ops
            formOp = {
                upsert: {
                    update: {
                        ...form
                    },
                    create: {
                        ...form
                    },
                    where: {
                        id: form.id,
                    }
                }
            }
        }
        let formFound = await prisma.form.findFirst({
            where: {
                assignmentId: assignment.id
            }
        });
        console.log({ formFound });
        if (assignment.form === undefined && formFound !== null) {
            //delete ops
            formOp = {
                delete: {
                    assignmentId: assignment.id
                }
            }
        }
        console.log({ ...formOp });
        let updatedTemplate = await prisma.assignment.update({
            data: formOp == undefined ? {
                ...body,
            } : {
                ...body,
                form: formOp
            },
            where: {
                id: assignment.id
            }
        })

        return updatedTemplate;
    }

    public async getAssignmentDetails(id: number) {
        try {
            const result = await prisma.assignment.findFirstOrThrow({
                where: {
                    id
                },
                include: {
                    group: {
                        select: {
                            id: true
                        }
                    },
                    form: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            return result;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro la asignación",
                    { id },
                    404
                )
            }
            throw error;
        }

    }

    public async getAllAssignments(classId: number, userId: number) {
        const result = await prisma.assignment.findMany({
            where: {
                classId,
                group: {
                    GroupDetails: {
                        some: {
                            userId
                        }
                    }
                }
            }
        });
        return result;
    }
}