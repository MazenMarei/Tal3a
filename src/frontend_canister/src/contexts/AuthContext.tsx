import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "@/services/auth";
import { User } from "@/types/user";

type AuthContextType = {
  isAuthenticated: boolean;
};

// Provide a default value to avoid undefined context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setIsAuthenticated(await authService.isAuthenticated());
    };

    initializeAuth();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (ctx.isAuthenticated === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
