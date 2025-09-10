import { Link as RouterLink } from "react-router-dom";
import { ReactNode } from "react";

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

const Link = ({ to, className = "", children, ...props }: LinkProps) => {
  return (
    <RouterLink
      to={to}
      className={`inline-block text-center no-underline transition-colors ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export { Link };
