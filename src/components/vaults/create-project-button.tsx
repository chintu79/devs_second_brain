"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/vaults/project-dialog";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1">
        <Plus className="h-4 w-4" /> New Project
      </Button>
      <ProjectDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
