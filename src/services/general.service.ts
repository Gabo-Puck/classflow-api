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
import ClassService from "./class.service";


export default class GeneralService {


    public async generateCode(tamano: number) {
        const characterSet = 'ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < tamano; i++) {
            const indice = Math.floor(Math.random() * characterSet.length);
            code += characterSet.charAt(indice);
        }
        return code;

    }
}