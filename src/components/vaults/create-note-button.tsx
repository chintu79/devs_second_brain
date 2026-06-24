"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteDialog } from "@/components/vaults/note-dialog";

export function CreateNoteButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1">
        <Plus className="h-4 w-4" /> Add Note
      </Button>
      <NoteDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
