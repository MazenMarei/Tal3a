/**
 * Simple Alert Component
 *
 * Basic alert functionality for displaying messages
 */

import React from "react";
import { cn } from "../../lib/utils";

interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "default",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-gray-200 bg-gray-50 text-gray-800",
        className
      )}
    >
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className,
}) => {
  return <div className={cn("text-sm", className)}>{children}</div>;
};
