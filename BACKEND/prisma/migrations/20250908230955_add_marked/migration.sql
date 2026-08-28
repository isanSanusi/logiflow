-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oleh" TEXT NOT NULL,
    "waktu" DATETIME NOT NULL,
    "pemesan" TEXT NOT NULL,
    "marked" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "ProductOrder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductOrder" ("companyId", "id", "oleh", "pemesan", "userId", "waktu") SELECT "companyId", "id", "oleh", "pemesan", "userId", "waktu" FROM "ProductOrder";
DROP TABLE "ProductOrder";
ALTER TABLE "new_ProductOrder" RENAME TO "ProductOrder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
