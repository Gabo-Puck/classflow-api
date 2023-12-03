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
import FormTemplateService from "./form-template.service";
export default class AssignmentService {
    generalService = new GeneralService();
    fileService = new FileService();
    formTemplateService = new FormTemplateService();
    public async create(assignment: AssingmentCreate, classId: number) {
        //search for template with the required email
        // let x: AssingmentCreate = 
        console.log({ assignment, classId });
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
        assignment.classId = classId;
        let { form, AssignmentFile: files, ...body } = { ...assignment };
        let filesConnect = [];
        for (let index = 0; index < files.length; index++) {
            const element = files[index].file;
            if (element.type == CREATE) {
                let file = await this.fileService.save(element.filename, element.base64, "storage/assignment")
                filesConnect.push({ fileId: file.id })
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
                        ...form,
                        questions: JSON.stringify(await this.formTemplateService.stringifyQuestions(form))
                    }
                },
                description: JSON.stringify(body.description),
                AssignmentFile: {
                    create: filesConnect
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
            console.log("XD");
            throw new ErrorService(
                "Ya existe una plantilla de formulario con ese nombre",
                assignment,
                400
            );
        }
        //parse user input to prisma obj
        let { form, AssignmentFile: files, ...body } = { ...assignment };
        assignment.classId = classId;
        let filesConnect = [];

        for (let index = 0; index < files.length; index++) {
            const element = files[index].file;
            if (element.type == CREATE) {
                let file = await this.fileService.save(element.filename, element.base64, "storage/assignment")
                filesConnect.push({ fileId: file.id })
            }
            if (element.type == DELETE) {
                await this.fileService.delete(element.id)
            }
        }
        let formOp = undefined;
        if (form !== undefined) {
            //update ops
            formOp = {
                upsert: {
                    update: {
                        ...form,
                        questions: JSON.stringify(await this.formTemplateService.stringifyQuestions(form))
                    },
                    create: {
                        ...form,
                        questions: JSON.stringify(await this.formTemplateService.stringifyQuestions(form))
                    },
                    where: {
                        assignmentId: body.id,
                    }
                }
            }
        }
        let formFound = await prisma.form.findFirst({
            where: {
                assignmentId: assignment.id
            }
        });

        if (assignment.form === undefined && formFound !== null) {
            //delete ops
            formOp = {
                delete: {
                    assignmentId: assignment.id
                }
            }
        }
        console.log({ ...formOp });

        body.description = JSON.stringify(body.description)
        let updatedTemplate = await prisma.assignment.update({
            data: formOp == undefined ? {
                ...body,
                AssignmentFile: {
                    create: filesConnect
                }
            } : {
                ...body,
                form: formOp,
                AssignmentFile: {
                    create: filesConnect
                }
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
                            name: true,
                            id: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                            termDetails: {
                                select: {
                                    name: true
                                }
                            }

                        }
                    },
                    form: true,
                    AssignmentFile: {
                        select: {
                            file: true
                        }
                    }
                }
            });
            if (result.form)
                result.form.questions = JSON.parse(result.form.questions)
            return { ...result, description: JSON.parse(result.description) };
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