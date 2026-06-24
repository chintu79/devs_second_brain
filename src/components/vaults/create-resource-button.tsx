"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceDialog } from "@/components/vaults/resource-dialog";

export function CreateResourceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1">
        <Plus className="h-4 w-4" /> Add Resource
      </Button>
      <ResourceDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
