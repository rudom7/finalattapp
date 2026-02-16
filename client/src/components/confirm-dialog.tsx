import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReactNode, useState, useEffect } from "react";

interface ConfirmDialogProps {
  children?: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showNotesField?: boolean;
  onNotesChange?: (notes: string) => void;
}

export function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  open,
  onOpenChange,
  showNotesField = false,
  onNotesChange,
}: ConfirmDialogProps) {
  const [notes, setNotes] = useState("");
  
  // Reset notes when dialog is opened or closed
  useEffect(() => {
    if (!open) {
      setNotes("");
    }
  }, [open]);
  
  // Update parent component when notes change
  useEffect(() => {
    if (onNotesChange) {
      onNotesChange(notes);
    }
  }, [notes, onNotesChange]);
  
  const handleConfirm = () => {
    onConfirm();
  };
  
  // Dialog content with optional notes field
  const dialogContent = (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      
      {showNotesField && (
        <div className="my-4">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes (optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Enter any additional notes or reasons for this change..."
            className="mt-1.5 min-h-[80px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      )}
      
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
        <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
  
  // If open and onOpenChange are provided, use them to control the dialog state
  if (open !== undefined && onOpenChange) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {children && (
          <AlertDialogTrigger asChild>
            {children}
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          {dialogContent}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Default uncontrolled behavior
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        {dialogContent}
      </AlertDialogContent>
    </AlertDialog>
  );
}
