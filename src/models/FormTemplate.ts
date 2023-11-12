import { FormTemplate as FormTemplatePrisma } from "@prisma/client";
import { TermTemplateDetails } from "./TermTemplateDetails";
import Question from "@appTypes/Question";

export interface FormTemplate extends Omit<FormTemplatePrisma, "questions"> {
    questions: Question[]
}
