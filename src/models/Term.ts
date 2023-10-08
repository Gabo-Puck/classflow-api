import { Term as TermPrisma, TermCategories } from "@prisma/client";



export interface Term extends TermPrisma {
    termCategories: TermCategories[]
}
