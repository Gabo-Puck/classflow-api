-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TermTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "TermTemplate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TermTemplate" ("createdAt", "creatorId", "id", "name", "updatedAt") SELECT "createdAt", "creatorId", "id", "name", "updatedAt" FROM "TermTemplate";
DROP TABLE "TermTemplate";
ALTER TABLE "new_TermTemplate" RENAME TO "TermTemplate";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "lastname", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "lastname", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_TermTemplateDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "termTemplateId" INTEGER NOT NULL,
    CONSTRAINT "TermTemplateDetails_termTemplateId_fkey" FOREIGN KEY ("termTemplateId") REFERENCES "TermTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TermTemplateDetails" ("createdAt", "id", "name", "termTemplateId", "updatedAt", "value") SELECT "createdAt", "id", "name", "termTemplateId", "updatedAt", "value" FROM "TermTemplateDetails";
DROP TABLE "TermTemplateDetails";
ALTER TABLE "new_TermTemplateDetails" RENAME TO "TermTemplateDetails";
CREATE TABLE "new_TermTemplateDetailsCategories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "termTemplateDetailsId" INTEGER NOT NULL,
    CONSTRAINT "TermTemplateDetailsCategories_termTemplateDetailsId_fkey" FOREIGN KEY ("termTemplateDetailsId") REFERENCES "TermTemplateDetails" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TermTemplateDetailsCategories" ("createdAt", "id", "name", "termTemplateDetailsId", "updatedAt", "value") SELECT "createdAt", "id", "name", "termTemplateDetailsId", "updatedAt", "value" FROM "TermTemplateDetailsCategories";
DROP TABLE "TermTemplateDetailsCategories";
ALTER TABLE "new_TermTemplateDetailsCategories" RENAME TO "TermTemplateDetailsCategories";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
