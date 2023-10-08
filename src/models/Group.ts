import { Group as GroupPrisma, GroupDetails } from "@prisma/client";



export interface Group extends GroupPrisma {
    GroupDetails: GroupDetails[]
}
export interface GroupC extends GroupPrisma {
    GroupDetails: Omit<GroupDetails, "groupId" | "joinedAt" | "status">[]
}

export type GroupCreate = Omit<GroupC, "id" | "createdAt" | "updatedAt" | "archived">

