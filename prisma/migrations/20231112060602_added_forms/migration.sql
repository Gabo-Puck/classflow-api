/*
  Warnings:

  - Added the required column `assignmentId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questions` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answers` to the `AnswerDeliverable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "questions" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    CONSTRAINT "Form_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("id") SELECT "id" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_assignmentId_key" ON "Form"("assignmentId");
CREATE TABLE "new_Assignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "latePenalty" BOOLEAN NOT NULL DEFAULT false,
    "penaltyValue" DECIMAL NOT NULL DEFAULT 0,
    "dueAt" DATETIME NOT NULL,
    "groupId" INTEGER NOT NULL,
    "formId" INTEGER,
    "autoGrade" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "formTemplateId" INTEGER,
    CONSTRAINT "Assignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TermCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("categoryId", "createdAt", "dueAt", "formId", "groupId", "id", "latePenalty", "penaltyValue", "title", "updatedAt") SELECT "categoryId", "createdAt", "dueAt", "formId", "groupId", "id", "latePenalty", "penaltyValue", "title", "updatedAt" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
CREATE TABLE "new_AnswerDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deliverableId" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    CONSTRAINT "AnswerDeliverable_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "Deliverable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AnswerDeliverable" ("deliverableId", "id") SELECT "deliverableId", "id" FROM "AnswerDeliverable";
DROP TABLE "AnswerDeliverable";
ALTER TABLE "new_AnswerDeliverable" RENAME TO "AnswerDeliverable";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
