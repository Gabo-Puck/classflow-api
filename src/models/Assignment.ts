import { FileBody } from "@appTypes/Files";
import { Assignment as AssingmentPrisma, Form as FormPrisma } from "@prisma/client";
import { FormTemplate } from "./FormTemplate";



export interface Assignment extends AssingmentPrisma {
    form?: FormTemplate
    AssignmentFile: { file: FileBody }[]
}

export type AssingmentCreate = Assignment

