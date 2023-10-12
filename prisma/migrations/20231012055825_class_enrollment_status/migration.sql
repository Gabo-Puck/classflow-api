/*
  Warnings:

  - Added the required column `status` to the `ClassEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ClassEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassEnrollment" (
    "classId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "enrolledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" INTEGER NOT NULL,

    PRIMARY KEY ("studentId", "classId"),
    CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClassEnrollment" ("classId", "enrolledAt", "studentId") SELECT "classId", "enrolledAt", "studentId" FROM "ClassEnrollment";
DROP TABLE "ClassEnrollment";
ALTER TABLE "new_ClassEnrollment" RENAME TO "ClassEnrollment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
