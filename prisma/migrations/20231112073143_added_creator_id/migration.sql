/*
  Warnings:

  - Added the required column `creatorId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    CONSTRAINT "Form_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("assignmentId", "id", "name", "questions") SELECT "assignmentId", "id", "name", "questions" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_assignmentId_key" ON "Form"("assignmentId");
CREATE TABLE "new_FormTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "FormTemplate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FormTemplate" ("id", "name", "questions") SELECT "id", "name", "questions" FROM "FormTemplate";
DROP TABLE "FormTemplate";
ALTER TABLE "new_FormTemplate" RENAME TO "FormTemplate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
