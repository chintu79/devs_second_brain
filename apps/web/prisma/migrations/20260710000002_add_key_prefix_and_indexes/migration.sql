-- Add keyPrefix to ApiKey for O(1) auth lookup (nullable for legacy keys)
ALTER TABLE "ApiKey" ADD COLUMN "keyPrefix" TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS "ApiKey_keyPrefix_idx" ON "ApiKey"("keyPrefix");
CREATE INDEX IF NOT EXISTS "KnowledgeItem_title_idx" ON "KnowledgeItem"("title");
CREATE INDEX IF NOT EXISTS "Capture_knowledgeItemId_idx" ON "Capture"("knowledgeItemId");
