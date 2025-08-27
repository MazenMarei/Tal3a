// Authentication Context - Manages Internet Identity authentication and canister actors
import React, { createContext, useState, useEffect, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";

// Canister imports
import {
  createActor as createUserActor,
  canisterId as userCanisterId,
} from "../../../declarations/user_canister";
import {
  createActor as createEventActor,
  canisterId as eventCanisterId,
} from "../../../declarations/event_canister";
import {
  createActor as createSocialActor,
  canisterId as socialCanisterId,
} from "../../../declarations/social_canister";

// Environment configuration
const network = import.meta.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app"
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    authClient: null,
    isAuthenticated: false,
    principal: null,
    identity: null,
    loading: true,
  });

  const [actors, setActors] = useState({
    user: null,
    event: null,
    social: null,
  });

  // Initialize actors with the current identity
  const initializeActors = useCallback((identity) => {
    try {
      const agentOptions = identity
        ? {
            identity,
            // For local development, disable certificate verification
            ...(network !== "ic" && {
              verifyQuerySignatures: false,
              fetchRootKey: true,
            }),
          }
        : {
            ...(network !== "ic" && {
              verifyQuerySignatures: false,
              fetchRootKey: true,
            }),
          };

      const userActor = createUserActor(userCanisterId, { agentOptions });
      const eventActor = createEventActor(eventCanisterId, { agentOptions });
      const socialActor = createSocialActor(socialCanisterId, { agentOptions });

      setActors({
        user: userActor,
        event: eventActor,
        social: socialActor,
      });

      return { userActor, eventActor, socialActor };
    } catch (error) {
      console.error("Error initializing actors:", error);
      return null;
    }
  }, []);

  // Update authentication state and actors
  const updateAuthState = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();

      setAuthState({
        authClient,
        isAuthenticated,
        principal: isAuthenticated ? principal : null,
        identity: isAuthenticated ? identity : null,
        loading: false,
      });

      // Initialize actors with the current identity
      initializeActors(identity);
    } catch (error) {
      console.error("Error updating auth state:", error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, [initializeActors]);

  // Login with Internet Identity
  const login = async () => {
    try {
      if (!authState.authClient) return;

      await authState.authClient.login({
        identityProvider,
        onSuccess: async () => {
          await updateAuthState();
        },
        onError: (error) => {
          console.error("Login error:", error);
        },
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (!authState.authClient) return;

      await authState.authClient.logout();
      await updateAuthState();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Initialize auth client on mount
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  const value = {
    ...authState,
    actors,
    login,
    logout,
    updateAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
