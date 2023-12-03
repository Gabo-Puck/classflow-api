/*
  Warnings:

  - You are about to drop the column `penaltyValue` on the `Assignment` table. All the data in the column will be lost.
  - You are about to alter the column `latePenalty` on the `Assignment` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "lateDelivery" BOOLEAN NOT NULL DEFAULT false,
    "latePenalty" INTEGER NOT NULL DEFAULT 0,
    "dueAt" DATETIME NOT NULL,
    "groupId" INTEGER NOT NULL,
    "formId" INTEGER,
    "autoGrade" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "classId" INTEGER NOT NULL,
    CONSTRAINT "Assignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TermCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("autoGrade", "categoryId", "classId", "createdAt", "description", "dueAt", "formId", "groupId", "id", "lateDelivery", "latePenalty", "title", "updatedAt") SELECT "autoGrade", "categoryId", "classId", "createdAt", "description", "dueAt", "formId", "groupId", "id", "lateDelivery", "latePenalty", "title", "updatedAt" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
