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
import ClassService from "./class.service";
import UserService from "./user.service";


export default class EnrollmentService {
    classService = new ClassService();
    userService = new UserService();
    public async createEnrollmentBatch(classId: number, idUsers: number[]) {

        //exist class validation
        await this.classService.getClassDetails(classId);
        for (let index = 0; index < idUsers.length; index++) {
            const idUser = idUsers[index];
            //exist user validation
            await this.userService.getUserById(idUser);
            let enrollmentFound = await prisma.classEnrollment.findFirst({
                where: {
                    classId,
                    studentId: idUser
                }
            })
            //if there is an enrollment, update
            if (enrollmentFound) {
                await prisma.classEnrollment.update({
                    where: {
                        studentId_classId: {
                            classId,
                            studentId: idUser
                        }
                    },
                    data: {
                        status: EnrollmentStatus.PENDING,
                    },

                })
            } else {
                await prisma.classEnrollment.create({
                    data: {
                        classId,
                        studentId: idUser,
                        status: EnrollmentStatus.PENDING
                    }
                })
            }
        }
        //parse user input to prisma inseriton obj
        return {};
    }
    public async enroll(classId: number, studentId: number): Promise<Partial<ClassModel>> {
        await this.classService.getClassDetails(classId);
        const result = await prisma.classEnrollment.update({
            data: {
                enrolledAt: new Date(),
                status: EnrollmentStatus.ENROLLED
            },
            where: {
                studentId_classId: {
                    classId,
                    studentId
                },
                status: EnrollmentStatus.PENDING
            }
        });
        return result;
    }

    public async drop(classId: number, studentId: number): Promise<Partial<ClassModel>> {
        await this.classService.getClassDetails(classId);
        const result = await prisma.classEnrollment.update({
            data: {
                enrolledAt: new Date(),
                status: EnrollmentStatus.DROPOUT
            },
            where: {
                studentId_classId: {
                    classId,
                    studentId
                },
                status: EnrollmentStatus.ENROLLED
            }
        });
        return result;
    }
    public async reject(classId: number, studentId: number): Promise<Partial<ClassModel>> {
        await this.classService.getClassDetails(classId);
        const result = await prisma.classEnrollment.delete({
            where: {
                studentId_classId: {
                    classId,
                    studentId
                },
                status: EnrollmentStatus.PENDING
            }
        });
        return result;
    }

    public async getInvitationsStudent(idUser: number) {
        const result = await prisma.classEnrollment.findMany({
            where: {
                studentId: idUser
            },
            include: {
                class: {
                    include: {
                        professor: true
                    }
                }
            }
        });
        return result;
    }
    public async getInvitationsClass(classId: number) {
        const result = await prisma.classEnrollment.findMany({
            where: {
                classId
            }
        });
        return result;
    }

}