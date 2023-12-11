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
import { AssignmentOrderObject } from "@appTypes/Assignment";

const enum AssignmentOrderEnum {
    COMPLETED = 1,
    PENDING,
    NEWEST,
    OLDEST,
    CLASIFICATION
}
type AssignmentOrderByCompleted = { order: AssignmentOrderEnum.COMPLETED };
type AssignmentOrderByPending = { order: AssignmentOrderEnum.PENDING };
type AssignmentOrderByNewest = { order: AssignmentOrderEnum.NEWEST };
type AssignmentOrderByOldest = { order: AssignmentOrderEnum.OLDEST };
type AssignmentOrderByClasification = { order: AssignmentOrderEnum.CLASIFICATION, category: number };
type AssignmentOrder = AssignmentOrderByCompleted | AssignmentOrderByPending | AssignmentOrderByNewest | AssignmentOrderByOldest | AssignmentOrderByClasification

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
                            studentId,
                            deliveredAt: new Date()
                        },
                        update: {
                            delivered: state,
                            studentId,
                            deliveredAt: new Date()
                        },
                        where: {
                            assignmentId_studentId: {
                                assignmentId: id,
                                studentId
                            }
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

    public sortByCompleted(assignments: AssignmentOrderObject[]) {
        let x = assignments.sort((a, b) => {
            if (a.Deliverable[0] && a.Deliverable[0].delivered && (!b.Deliverable[0] || !b.Deliverable[0].delivered)) {
                return -1; // a viene antes que b
            } else if (b.Deliverable[0] && b.Deliverable[0].delivered && (!a.Deliverable[0] || !a.Deliverable[0].delivered)) {
                return 1; // b viene antes que a
            } else {
                return 0; // no hay prioridad, mantiene el orden original
            }
        });
        return x;
    }

    public sortByPending(assignments: AssignmentOrderObject[]) {
        let x = assignments.sort((a, b) => {
            if (a.Deliverable[0] && a.Deliverable[0].delivered && (!b.Deliverable[0] || !b.Deliverable[0].delivered)) {
                return 1; // a viene antes que b
            } else if (b.Deliverable[0] && b.Deliverable[0].delivered && (!a.Deliverable[0] || !a.Deliverable[0].delivered)) {
                return -1; // b viene antes que a
            } else {
                return 0; // no hay prioridad, mantiene el orden original
            }
        });
        return x;
    }

    public sortByClasification(assignments: AssignmentOrderObject[], category: number) {
        return assignments.sort((a, b) => {
            if (a.categoryId === category && b.categoryId !== category) {
                return -1; // a viene antes que b
            } else if (b.categoryId === category && a.categoryId !== category) {
                return 1; // b viene antes que a
            } else {
                return 0; // no hay prioridad, mantiene el orden original
            }
        })
    }

    public async getAllAssignments(classId: number, userId: number, orderType: AssignmentOrder) {
        let order = {};
        console.log("AYUDA2", orderType.order)
        switch (orderType.order) {
            case AssignmentOrderEnum.NEWEST:
                order = {
                    ...order,
                    createdAt: "asc"
                }
                break;
            case AssignmentOrderEnum.OLDEST:
                console.log(orderType.order)
                order = {
                    ...order,
                    createdAt: "desc"
                }
                break;
        }
        let result = await prisma.assignment.findMany({
            where: {
                classId,
                group: {
                    GroupDetails: {
                        some: {
                            userId
                        }
                    }
                },
            },
            include: {
                Deliverable: {
                    where: {
                        studentId: userId
                    }
                }
            },
            orderBy: order
        });
        if (orderType.order == AssignmentOrderEnum.COMPLETED)
            result = this.sortByCompleted(result)
        if (orderType.order == AssignmentOrderEnum.PENDING)
            result = this.sortByPending(result)
        if (orderType.order == AssignmentOrderEnum.CLASIFICATION){
            console.log(orderType.category);
            result = this.sortByClasification(result, orderType.category)

        }
        return result;
    }
}