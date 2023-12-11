/*
  Warnings:

  - A unique constraint covering the columns `[assignmentId,studentId]` on the table `Deliverable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Deliverable_assignmentId_studentId_key" ON "Deliverable"("assignmentId", "studentId");
