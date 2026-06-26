/*
  Warnings:

  - The `tags` column on `Resource` will be dropped.
  - The `tags` column on `Prompt` will be dropped.
  - The `tags` column on `Note` will be dropped.
  - The `tags` column on `Project` will be dropped.

  Schema evolved from `tags TEXT[]` to junction tables (Tag, ResourceTag, PromptTag, NoteTag, ProjectTag).
  Existing tag data is NOT migrated — users must re-tag items after this migration.

  Run `node prisma/scripts/migrate-tags.mjs` after this migration to migrate existing tags.
*/

-- Drop old tags array columns
ALTER TABLE "Resource" DROP COLUMN IF EXISTS "tags";
ALTER TABLE "Prompt" DROP COLUMN IF EXISTS "tags";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "tags";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "tags";

-- Create Tag table
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- Create ResourceTag junction table
CREATE TABLE "ResourceTag" (
    "resourceId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ResourceTag_pkey" PRIMARY KEY ("resourceId", "tagId")
);

-- Create PromptTag junction table
CREATE TABLE "PromptTag" (
    "promptId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PromptTag_pkey" PRIMARY KEY ("promptId", "tagId")
);

-- Create NoteTag junction table
CREATE TABLE "NoteTag" (
    "noteId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId", "tagId")
);

-- Create ProjectTag junction table
CREATE TABLE "ProjectTag" (
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("projectId", "tagId")
);

-- Unique constraint: one tag name per user
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "Tag"("name", "userId");

-- Foreign keys: Tag → User
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign keys: ResourceTag → Resource + Tag
ALTER TABLE "ResourceTag" ADD CONSTRAINT "ResourceTag_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceTag" ADD CONSTRAINT "ResourceTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign keys: PromptTag → Prompt + Tag
ALTER TABLE "PromptTag" ADD CONSTRAINT "PromptTag_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PromptTag" ADD CONSTRAINT "PromptTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign keys: NoteTag → Note + Tag
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign keys: ProjectTag → Project + Tag
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
