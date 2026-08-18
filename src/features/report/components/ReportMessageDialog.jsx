import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ============================================================================
// Helpers
// ============================================================================

const getMessagePreview = (message, wordLimit = 3) => {
  if (!message?.trim()) {
    return "—";
  }

  const words = message.trim().split(/\s+/);

  const preview = words.slice(0, wordLimit).join(" ");

  if (words.length <= wordLimit) {
    return preview;
  }

  return `${preview}...`;
};

// ============================================================================
// Report message dialog
// ============================================================================

export default function ReportMessageDialog({ message }) {
  if (!message?.trim()) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="max-w-55 cursor-pointer text-left text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
          title="Click to view full report"
        >
          {getMessagePreview(message)}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Report Message</DialogTitle>

          <DialogDescription>
            Full message submitted by the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto rounded-lg border bg-muted/30 p-4">
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
