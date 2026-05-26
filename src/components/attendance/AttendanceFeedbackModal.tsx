import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FeedbackStatus = "success" | "error" | null;

export interface AttendanceFeedbackModalProps {
  status: FeedbackStatus;
  title?: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function AttendanceFeedbackModal({
  status,
  title,
  message,
  isOpen,
  onClose,
  autoCloseMs = 3000,
}: AttendanceFeedbackModalProps) {
  useEffect(() => {
    if (isOpen && autoCloseMs && status !== null) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, status, onClose]);

  if (!status) return null;

  const isSuccess = status === "success";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-white border-0 shadow-2xl p-0 overflow-hidden outline-none"
        aria-describedby={undefined}
      >
        <div className="flex flex-col items-center justify-center p-8 pt-10 text-center animate-in zoom-in-95 duration-300">
          {/* Icon with bounce and scale animation */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${
              isSuccess
                ? "bg-emerald-100 text-emerald-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-16 h-16 animate-[bounce_1s_ease-in-out_infinite]" />
            ) : (
              <XCircle className="w-16 h-16 animate-[pulse_1s_ease-in-out_infinite]" />
            )}
          </div>

          <DialogTitle
            className={`text-2xl font-bold mb-2 ${isSuccess ? "text-emerald-600" : "text-red-600"}`}
          >
            {title || (isSuccess ? "Berhasil!" : "Gagal")}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-lg mb-8 max-w-xs mx-auto leading-relaxed">
            {message}
          </DialogDescription>

          <Button
            onClick={onClose}
            className={`w-full h-12 text-lg font-medium text-white transition-all active:scale-95 ${
              isSuccess
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
