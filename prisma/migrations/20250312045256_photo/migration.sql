/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `AssignTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserHasPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssignTask" DROP CONSTRAINT "AssignTask_todoId_fkey";

-- DropForeignKey
ALTER TABLE "AssignTask" DROP CONSTRAINT "AssignTask_userId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserHasPermission" DROP CONSTRAINT "UserHasPermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserHasRole" DROP CONSTRAINT "UserHasRole_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "photo" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserHasRole" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "AssignTask";

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "UserHasPermission";

-- DropEnum
DROP TYPE "Status";

-- AddForeignKey
ALTER TABLE "UserHasRole" ADD CONSTRAINT "UserHasRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
