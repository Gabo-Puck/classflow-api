/*
  Warnings:

  - Added the required column `description` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "deletedAt" DATETIME,
    "archivedAt" DATETIME,
    CONSTRAINT "Class_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("archived", "archivedAt", "createdAt", "creatorId", "deleted", "deletedAt", "id", "name", "updatedAt") SELECT "archived", "archivedAt", "createdAt", "creatorId", "deleted", "deletedAt", "id", "name", "updatedAt" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
