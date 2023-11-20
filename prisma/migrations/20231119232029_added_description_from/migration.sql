-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "questions" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FormTemplate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FormTemplate" ("createdAt", "creatorId", "id", "name", "questions", "updatedAt") SELECT "createdAt", "creatorId", "id", "name", "questions", "updatedAt" FROM "FormTemplate";
DROP TABLE "FormTemplate";
ALTER TABLE "new_FormTemplate" RENAME TO "FormTemplate";
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "questions" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Form_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("assignmentId", "createdAt", "creatorId", "id", "name", "questions", "updatedAt") SELECT "assignmentId", "createdAt", "creatorId", "id", "name", "questions", "updatedAt" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_assignmentId_key" ON "Form"("assignmentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
