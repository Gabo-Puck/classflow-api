import { TermTemplateDetailsCategories, TermTemplateDetails as TermTemplateDetailsPrisma } from "@prisma/client";

export interface TermTemplateDetails extends TermTemplateDetailsPrisma {
    termTemplateDetailsCategories: TermTemplateDetailsCategories[]
}