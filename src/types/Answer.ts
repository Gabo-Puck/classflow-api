import { FileClassflow } from "./File";
import PossibleAnswer from "./PossibleAnswer";
import { QuestionTypes } from "./QuestionTypes"

type OpenPayload = { type: QuestionTypes.OPEN, data: string };
type MultiplePaload = { type: QuestionTypes.MULTIPLE; data: PossibleAnswer[] };
type ClosedPayload = { type: QuestionTypes.CLOSED; data: PossibleAnswer };
type FilePayload = {
    type: QuestionTypes.FILE; data: FileClassflow
};

export default interface Answer {
    id: String
    question: String
    value: number
    required: Boolean
    payload: OpenPayload | MultiplePaload | ClosedPayload | FilePayload
}