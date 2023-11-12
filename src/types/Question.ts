import PossibleAnswer from "./PossibleAnswer";
import { QuestionTypes } from "./QuestionTypes"

type OpenQuestion = { type: QuestionTypes.OPEN };
type MultipleQuestion = { type: QuestionTypes.MULTIPLE; data: PossibleAnswer[] };
type ClosedQuestion = { type: QuestionTypes.CLOSED; data: PossibleAnswer[] };
type FileQuestion = { type: QuestionTypes.FILE; };

export default interface Question {
    id: String
    question: String
    value: number
    required: Boolean
    payload: OpenQuestion | MultipleQuestion | ClosedQuestion | FileQuestion
}
