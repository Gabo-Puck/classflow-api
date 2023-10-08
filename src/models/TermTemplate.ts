import { TermTemplate as TermTemplatePrisma } from "@prisma/client";
import { TermTemplateDetails } from "./TermTemplateDetails";

export interface TermTemplate extends TermTemplatePrisma{
    termDetails: TermTemplateDetails[]
}
