/*
  Warnings:

  - You are about to drop the column `password` on the `Company` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ProductOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oleh" TEXT NOT NULL,
    "waktu" DATETIME NOT NULL,
    "pemesan" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "ProductOrder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kategori" TEXT NOT NULL,
    "ukuran" INTEGER NOT NULL,
    "diameter" INTEGER NOT NULL,
    "volume" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    CONSTRAINT "ProductItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "email" TEXT NOT NULL
);
INSERT INTO "new_Company" ("address", "email", "id", "name", "ownerName", "phone") SELECT "address", "email", "id", "name", "ownerName", "phone" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
CREATE TABLE "new_RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RefreshToken" ("createdAt", "expiresAt", "id", "revoked", "token", "userId") SELECT "createdAt", "expiresAt", "id", "revoked", "token", "userId" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "companyId" INTEGER,
    CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("companyId", "fullName", "id", "password", "role", "username") SELECT "companyId", "fullName", "id", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
