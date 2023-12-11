import { Assignment, Deliverable } from "prisma/prisma-client"

export interface AssignmentOrderObject extends Assignment{
    Deliverable: Deliverable[]
}
