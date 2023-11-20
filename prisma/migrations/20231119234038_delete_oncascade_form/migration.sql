-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnswerDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deliverableId" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    CONSTRAINT "AnswerDeliverable_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "Deliverable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AnswerDeliverable" ("answers", "deliverableId", "id") SELECT "answers", "deliverableId", "id" FROM "AnswerDeliverable";
DROP TABLE "AnswerDeliverable";
ALTER TABLE "new_AnswerDeliverable" RENAME TO "AnswerDeliverable";
CREATE TABLE "new_NoteDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "noteId" INTEGER NOT NULL,
    "deliverableId" INTEGER NOT NULL,
    CONSTRAINT "NoteDeliverable_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NoteDeliverable_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "Deliverable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NoteDeliverable" ("deliverableId", "id", "noteId") SELECT "deliverableId", "id", "noteId" FROM "NoteDeliverable";
DROP TABLE "NoteDeliverable";
ALTER TABLE "new_NoteDeliverable" RENAME TO "NoteDeliverable";
CREATE TABLE "new_FileDeliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deliverableId" INTEGER NOT NULL,
    CONSTRAINT "FileDeliverable_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "Deliverable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FileDeliverable" ("createdAt", "deliverableId", "direction", "filename", "id", "updatedAt") SELECT "createdAt", "deliverableId", "direction", "filename", "id", "updatedAt" FROM "FileDeliverable";
DROP TABLE "FileDeliverable";
ALTER TABLE "new_FileDeliverable" RENAME TO "FileDeliverable";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
