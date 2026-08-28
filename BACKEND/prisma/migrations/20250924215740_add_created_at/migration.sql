-- CreateTable
CREATE TABLE "ProductHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oleh" TEXT NOT NULL,
    "waktu" DATETIME NOT NULL,
    "pemesan" TEXT NOT NULL,
    "marked" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "ProductHistory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kategori" TEXT NOT NULL,
    "ukuran" INTEGER NOT NULL,
    "diameter" INTEGER NOT NULL,
    "volume" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    CONSTRAINT "ItemHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductHistory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Company" ("address", "email", "id", "name", "ownerName", "phone") SELECT "address", "email", "id", "name", "ownerName", "phone" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER,
    CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("companyId", "fullName", "id", "password", "role", "username") SELECT "companyId", "fullName", "id", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
