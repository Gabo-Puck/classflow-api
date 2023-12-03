-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssignmentFile" (
    "assignmentId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    PRIMARY KEY ("assignmentId", "fileId"),
    CONSTRAINT "AssignmentFile_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssignmentFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssignmentFile" ("assignmentId", "fileId") SELECT "assignmentId", "fileId" FROM "AssignmentFile";
DROP TABLE "AssignmentFile";
ALTER TABLE "new_AssignmentFile" RENAME TO "AssignmentFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
