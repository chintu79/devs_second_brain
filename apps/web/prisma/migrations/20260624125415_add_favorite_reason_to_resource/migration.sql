-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reason" TEXT;
