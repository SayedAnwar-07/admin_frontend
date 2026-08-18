import { useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ReportImageDialog({
  imageUrl,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const hasImage = Boolean(imageUrl);

  const handleOpen = () => {
    if (!hasImage || disabled) {
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 cursor-pointer"
        title={hasImage ? "View report image" : "No report image"}
        disabled={disabled || !hasImage}
        onClick={handleOpen}
      >
        <Eye className="size-4" />

        <span className="sr-only">
          {hasImage ? "View report image" : "No report image"}
        </span>
      </Button>

      {hasImage && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Report Image</DialogTitle>

              <DialogDescription>
                Image submitted by the customer with this report.
              </DialogDescription>
            </DialogHeader>

            <div className="flex max-h-[75vh] w-full items-center justify-center overflow-auto rounded-lg border bg-muted/20 p-2">
              <img
                src={imageUrl}
                alt="Customer report"
                className="max-h-[70vh] max-w-full rounded-md object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}