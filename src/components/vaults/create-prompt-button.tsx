"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptDialog } from "@/components/vaults/prompt-dialog";

export function CreatePromptButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1">
        <Plus className="h-4 w-4" /> Add Prompt
      </Button>
      <PromptDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
