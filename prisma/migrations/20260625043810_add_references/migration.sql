-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromType" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toType" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reference_fromType_fromId_idx" ON "Reference"("fromType", "fromId");

-- CreateIndex
CREATE INDEX "Reference_toType_toId_idx" ON "Reference"("toType", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "Reference_userId_fromType_fromId_toType_toId_key" ON "Reference"("userId", "fromType", "fromId", "toType", "toId");

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
