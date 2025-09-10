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
      // Wait for crypto to be available before initializing auth
      const waitForCrypto = (): Promise<void> => {
        return new Promise((resolve) => {
          // Check if crypto is already available
          if (globalThis.crypto && globalThis.crypto.subtle) {
            resolve();
            return;
          }

          // If not available, wait for the cryptoReady event
          const handleCryptoReady = () => {
            window.removeEventListener("cryptoReady", handleCryptoReady);
            resolve();
          };

          window.addEventListener("cryptoReady", handleCryptoReady);

          // Also check periodically in case the event was missed
          const checkInterval = setInterval(() => {
            if (globalThis.crypto && globalThis.crypto.subtle) {
              clearInterval(checkInterval);
              window.removeEventListener("cryptoReady", handleCryptoReady);
              resolve();
            }
          }, 100);
        });
      };

      try {
        await waitForCrypto();
        if (isMounted) {
          setIsAuthenticated(await authService.isAuthenticated());
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
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
