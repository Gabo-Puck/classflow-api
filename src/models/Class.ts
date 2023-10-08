import { Class as ClassPrisma } from "@prisma/client";
import { Term } from "@models/index";


export interface ClassModel extends ClassPrisma {
    terms: Term[]
}
