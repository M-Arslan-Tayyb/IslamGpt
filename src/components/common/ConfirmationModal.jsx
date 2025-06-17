import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  primaryButtonText = "Confirm",
  secondaryButtonText = "Cancel",
  variant = "default",
  isLoading = false,
  showIcon = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConfirm = async () => {
    setIsAnimating(true);
    try {
      await onConfirm();
    } finally {
      setIsAnimating(false);
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          headerBg: "bg-red-50 border-red-200",
          titleColor: "text-red-900",
          descriptionColor: "text-red-700",
          primaryButton: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "warning":
        return {
          headerBg: "bg-yellow-50 border-yellow-200",
          titleColor: "text-yellow-900",
          descriptionColor: "text-yellow-700",
          primaryButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
        };
      case "success":
        return {
          headerBg: "bg-green-50 border-green-200",
          titleColor: "text-green-900",
          descriptionColor: "text-green-700",
          primaryButton: "bg-green-600 hover:bg-green-700 text-white",
        };
      default:
        return {
          headerBg: "bg-blue-50 border-blue-200",
          titleColor: "text-blue-900",
          descriptionColor: "text-blue-700",
          primaryButton: "bg-blue-600 hover:bg-blue-700 text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1 rounded-t-lg transition-all duration-300",
            variant === "destructive" && "bg-red-500",
            variant === "warning" && "bg-yellow-500",
            variant === "success" && "bg-green-500",
            variant === "default" && "bg-blue-500"
          )}
        />

        <DialogHeader className={cn("pb-4 border-b ", styles.headerBg)}>
          <div className="flex items-center justify-center gap-3">
            {showIcon && (
              <div className="animate-in zoom-in-50 duration-300 delay-100">
                {getIcon()}
              </div>
            )}
            <div className="flex-1">
              <DialogTitle
                className={cn("text-lg font-semibold", styles.titleColor)}
              >
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <DialogDescription
            className={cn("text-sm leading-relaxed", styles.descriptionColor)}
          >
            {description}
          </DialogDescription>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading || isAnimating}
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
          >
            {secondaryButtonText}
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isLoading || isAnimating}
            className={cn(
              "w-full sm:w-auto transition-all duration-200 hover:scale-105 relative overflow-hidden",
              styles.primaryButton
            )}
          >
            {(isLoading || isAnimating) && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
            <span
              className={cn(
                "transition-opacity duration-200",
                (isLoading || isAnimating) && "opacity-70"
              )}
            >
              {isLoading || isAnimating ? "Processing..." : primaryButtonText}
            </span>
            {(isLoading || isAnimating) && (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
