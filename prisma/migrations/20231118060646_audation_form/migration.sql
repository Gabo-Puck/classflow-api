/*
  Warnings:

  - You are about to drop the column `formTemplateId` on the `Assignment` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Form_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("assignmentId", "creatorId", "id", "name", "questions") SELECT "assignmentId", "creatorId", "id", "name", "questions" FROM "Form";
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
    CONSTRAINT "Assignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TermCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("autoGrade", "categoryId", "createdAt", "dueAt", "formId", "groupId", "id", "latePenalty", "penaltyValue", "title", "updatedAt") SELECT "autoGrade", "categoryId", "createdAt", "dueAt", "formId", "groupId", "id", "latePenalty", "penaltyValue", "title", "updatedAt" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
