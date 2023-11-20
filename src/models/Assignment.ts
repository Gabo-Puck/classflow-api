import { FileBody } from "@appTypes/Files";
import { Assignment as AssingmentPrisma, Form as FormPrisma } from "@prisma/client";



export interface Assignment extends AssingmentPrisma {
    form?: FormPrisma
    files: FileBody[]
}

export type AssingmentCreate = Assignment

