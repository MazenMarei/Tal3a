/**
 * Simple Select Component
 *
 * Basic select functionality for the admin requests page
 */

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  value: "",
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  className,
  children,
}) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);

  return <span className="block truncate">{value || placeholder}</span>;
};

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="py-1 max-h-60 overflow-auto">{children}</div>
      </div>
    </>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const {
    onValueChange,
    setIsOpen,
    value: selectedValue,
  } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn(
        "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer",
        selectedValue === value && "bg-gray-100 font-medium"
      )}
      onClick={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
    >
      {children}
    </button>
  );
};
