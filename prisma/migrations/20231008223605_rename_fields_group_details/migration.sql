/*
  Warnings:

  - The primary key for the `GroupDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `enrolledAt` on the `GroupDetails` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `GroupDetails` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupDetails" (
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupRole" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY ("groupId", "userId"),
    CONSTRAINT "GroupDetails_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GroupDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GroupDetails" ("groupId", "groupRole", "status", "userId") SELECT "groupId", "groupRole", "status", "userId" FROM "GroupDetails";
DROP TABLE "GroupDetails";
ALTER TABLE "new_GroupDetails" RENAME TO "GroupDetails";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
