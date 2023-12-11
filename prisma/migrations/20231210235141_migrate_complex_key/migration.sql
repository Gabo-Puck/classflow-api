/*
  Warnings:

  - The primary key for the `Deliverable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Deliverable` table. All the data in the column will be lost.
  - You are about to drop the column `deliverableId` on the `AnswerDeliverable` table. All the data in the column will be lost.
  - You are about to drop the column `deliverableId` on the `FileDeliverable` table. All the data in the column will be lost.
  - You are about to drop the column `deliverableId` on the `NoteDeliverable` table. All the data in the column will be lost.
  - Added the required column `assignmentId` to the `AnswerDeliverable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `AnswerDeliverable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `FileDeliverable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `FileDeliverable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `NoteDeliverable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `NoteDeliverable` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deliverable" (
    "assignmentId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" DATETIME,
    "graded" BOOLEAN NOT NULL DEFAULT false,
    "finalGrade" DECIMAL NOT NULL DEFAULT 0,

    PRIMARY KEY ("assignmentId", "studentId"),
    CONSTRAINT "Deliverable_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Deliverable_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Deliverable" ("assignmentId", "createdAt", "delivered", "deliveredAt", "finalGrade", "graded", "studentId", "updatedAt") SELECT "assignmentId", "createdAt", "delivered", "deliveredAt", "finalGrade", "graded", "studentId", "updatedAt" FROM "Deliverable";
DROP TABLE "Deliverable";
ALTER TABLE "new_Deliverable" RENAME TO "Deliverable";
CREATE TABLE "new_AnswerDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    CONSTRAINT "AnswerDeliverable_studentId_assignmentId_fkey" FOREIGN KEY ("studentId", "assignmentId") REFERENCES "Deliverable" ("studentId", "assignmentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AnswerDeliverable" ("answers", "id") SELECT "answers", "id" FROM "AnswerDeliverable";
DROP TABLE "AnswerDeliverable";
ALTER TABLE "new_AnswerDeliverable" RENAME TO "AnswerDeliverable";
CREATE TABLE "new_FileDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    CONSTRAINT "FileDeliverable_studentId_assignmentId_fkey" FOREIGN KEY ("studentId", "assignmentId") REFERENCES "Deliverable" ("studentId", "assignmentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FileDeliverable" ("createdAt", "direction", "filename", "id", "updatedAt") SELECT "createdAt", "direction", "filename", "id", "updatedAt" FROM "FileDeliverable";
DROP TABLE "FileDeliverable";
ALTER TABLE "new_FileDeliverable" RENAME TO "FileDeliverable";
CREATE TABLE "new_NoteDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "noteId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    CONSTRAINT "NoteDeliverable_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NoteDeliverable_studentId_assignmentId_fkey" FOREIGN KEY ("studentId", "assignmentId") REFERENCES "Deliverable" ("studentId", "assignmentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NoteDeliverable" ("id", "noteId") SELECT "id", "noteId" FROM "NoteDeliverable";
DROP TABLE "NoteDeliverable";
ALTER TABLE "new_NoteDeliverable" RENAME TO "NoteDeliverable";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
