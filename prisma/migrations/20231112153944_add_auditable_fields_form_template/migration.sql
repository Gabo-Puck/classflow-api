/*
  Warnings:

  - Added the required column `updatedAt` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FormTemplate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FormTemplate" ("creatorId", "id", "name", "questions") SELECT "creatorId", "id", "name", "questions" FROM "FormTemplate";
DROP TABLE "FormTemplate";
ALTER TABLE "new_FormTemplate" RENAME TO "FormTemplate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
