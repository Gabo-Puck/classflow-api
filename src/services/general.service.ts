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

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
    keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
    string
>;

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



    public prismaExclude<T extends Entity, K extends Keys<T>>(
        type: T,
        omit: K[],
    ) {
        type Key = Exclude<Keys<T>, K>;
        type TMap = Record<Key, true>;
        const result: TMap = {} as TMap;
        for (const key in Prisma[`${type}ScalarFieldEnum`]) {
            if (!omit.includes(key as K)) {
                result[key as Key] = true;
            }
        }
        return result;
    }

}