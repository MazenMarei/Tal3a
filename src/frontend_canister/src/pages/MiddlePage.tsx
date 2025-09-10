import { AuthClient } from "@dfinity/auth-client";
import {
  Ed25519PublicKey,
  DelegationIdentity,
  ECDSAKeyIdentity,
  DelegationChain,
} from "@dfinity/identity";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

const identityProvider = "https://identity.ic0.app";
const NFIDProvider = "https://nfid.one/authenticate";

function MiddlePage() {
  const [searchParams] = useSearchParams();
  const redirect_uri = searchParams.get("redirect_uri");
  const sessionkey = searchParams.get("sessionkey");
  const login_type = searchParams.get("login_type");
  const [loading, setLoading] = useState(true);
  const [delegationChain, setDelegationChain] =
    useState<DelegationChain | null>(null);
  const [error, setError] = useState<string>("");
  // Handling delegated data after login
  const handleSuccessfulLogin = useCallback(
    async (
      authClientInstance: AuthClient,
      middleKeyIdentity: ECDSAKeyIdentity
    ) => {
      try {
        const middleIdentity = authClientInstance.getIdentity();
        if (!sessionkey) {
          return;
        }

        console.log("Session key received:", sessionkey);
        console.log("Session key length:", sessionkey.length);

        // Convert sessionkey to public key with better error handling
        let appPublicKey: Ed25519PublicKey;
        try {
          const sessionKeyBytes = hexToBytes(sessionkey);
          console.log("Session key bytes:", sessionKeyBytes);
          console.log("Session key bytes length:", sessionKeyBytes.length);

          appPublicKey = Ed25519PublicKey.fromDer(sessionKeyBytes);
          console.log("Successfully created Ed25519PublicKey from DER");
        } catch (derError) {
          console.error("DER decoding error:", derError);
          console.log(
            "Attempting to create public key directly from raw bytes..."
          );

          try {
            // If DER fails, try raw bytes (32 bytes for Ed25519)
            const sessionKeyBytes = hexToBytes(sessionkey);
            if (sessionKeyBytes.length === 32) {
              appPublicKey = Ed25519PublicKey.fromRaw(sessionKeyBytes);
              console.log(
                "Successfully created Ed25519PublicKey from raw bytes"
              );
            } else {
              throw new Error(
                `Invalid key length: expected 32 bytes, got ${sessionKeyBytes.length}`
              );
            }
          } catch (rawError) {
            console.error("Raw bytes error:", rawError);
            const errorMessage =
              derError instanceof Error
                ? derError.message
                : "Unknown DER error";
            throw new Error(`Failed to decode session key: ${errorMessage}`);
          }
        }

        // Creating Delegation Chain
        if (
          appPublicKey != null &&
          middleIdentity instanceof DelegationIdentity
        ) {
          let middleToApp = await DelegationChain.create(
            middleKeyIdentity,
            appPublicKey,
            new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days expiration
            { previous: middleIdentity.getDelegation() }
          );

          setDelegationChain(middleToApp);

          // Use the created delegation chain directly (not the state)
          const delegationString = JSON.stringify(middleToApp.toJSON());
          const encodedDelegation = encodeURIComponent(delegationString);

          setInterval(() => {
            window.location.href = `${redirect_uri}?del=${encodedDelegation}`;
          }, 1000);
        } else {
          throw new Error(
            "Failed to create delegation chain - invalid identity or public key"
          );
        }
      } catch (err) {
        console.error("Delegation error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [sessionkey, redirect_uri]
  );
  // Helper function to convert hex string to Uint8Array
  const hexToBytes = (hex: string): Uint8Array => {
    // Remove any whitespace and ensure even length
    const cleanHex = hex.replace(/\s/g, "");

    // Validate hex string
    if (!/^[0-9a-fA-F]*$/.test(cleanHex)) {
      throw new Error(`Invalid hex string: ${hex}`);
    }

    if (cleanHex.length % 2 !== 0) {
      throw new Error(`Hex string must have even length: ${cleanHex.length}`);
    }

    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }
    return bytes;
  };

  // Auto-start the login process when component mounts
  const handleLoginRedirect = useCallback(async () => {
    try {
      if (!redirect_uri || !sessionkey || !login_type) {
        throw new Error("Missing required parameters");
      }

      // Wait for crypto to be available (either native or polyfilled)
      const waitForCrypto = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          // Check if crypto is already available
          if (globalThis.crypto && globalThis.crypto.subtle) {
            console.log("Crypto API is available");
            resolve();
            return;
          }

          // If not available, wait for the cryptoReady event
          const timeout = setTimeout(() => {
            reject(new Error("Crypto API not available after timeout"));
          }, 10000); // 10 second timeout

          const handleCryptoReady = () => {
            clearTimeout(timeout);
            window.removeEventListener("cryptoReady", handleCryptoReady);

            if (globalThis.crypto && globalThis.crypto.subtle) {
              console.log("Crypto API is now available via polyfill");
              resolve();
            } else {
              reject(
                new Error("Crypto API still not available after polyfill")
              );
            }
          };

          window.addEventListener("cryptoReady", handleCryptoReady);

          // Also check periodically in case the event was missed
          const checkInterval = setInterval(() => {
            if (globalThis.crypto && globalThis.crypto.subtle) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              window.removeEventListener("cryptoReady", handleCryptoReady);
              console.log("Crypto API detected via polling");
              resolve();
            }
          }, 100);
        });
      };

      await waitForCrypto();

      console.log("Creating middle key identity...");
      // Creating a middle key identity
      const middleKeyIdentity = await ECDSAKeyIdentity.generate();
      console.log("Middle key identity created successfully");

      const authClient = await AuthClient.create({
        identity: middleKeyIdentity,
      });
      console.log("Auth client created successfully");

      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider:
            login_type === "ii" ? identityProvider : NFIDProvider,
          // Add these options to control the window behavior
          windowOpenerFeatures:
            "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
          // Or disable popup entirely and use redirect
          derivationOrigin: window.location.origin,
          onSuccess: async () => {
            try {
              await handleSuccessfulLogin(authClient, middleKeyIdentity);
              setLoading(false);
              resolve(true);
            } catch (err) {
              reject(err);
            }
          },
          onError: (err) => {
            reject(err);
          },
        });
      });
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [redirect_uri, sessionkey, login_type, handleSuccessfulLogin]);

  useEffect(() => {
    if (redirect_uri && sessionkey && login_type) {
      handleLoginRedirect();
    } else {
      setError("Missing required parameters");
    }
  }, [handleLoginRedirect, redirect_uri, sessionkey, login_type]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Authentication Issue :{error}
              </h2>
              <p className="text-gray-600">
                Something went wrong during authentication
              </p>
            </div>

            {/* Status Message */}
            <div className="w-full">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-orange-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-orange-700 text-sm">
                    Please try again or contact support if the issue persists
                  </p>
                </div>
              </div>
            </div>

            {/* Manual Back to App Button */}
            <div className="w-full space-y-3">
              <button
                onClick={() => {
                  if (redirect_uri && delegationChain) {
                    // Use the created delegation chain directly (not the state)
                    const delegationString = JSON.stringify(
                      delegationChain.toJSON()
                    );
                    const encodedDelegation =
                      encodeURIComponent(delegationString);

                    window.location.href = `${redirect_uri}?del=${encodedDelegation}`;
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                Back to App
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Try Again
              </button>

              <p className="text-xs text-gray-500 text-center">
                You can try authentication again or return to the app
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!loading && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Login Successful!
              </h2>
              <p className="text-gray-600">
                You have been successfully authenticated
              </p>
            </div>

            {/* Progress Steps */}
            <div className="w-full space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Identity verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Delegation created
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  Redirecting to app...
                </span>
              </div>
            </div>

            {/* Manual Back to App Button */}
            <div className="w-full space-y-3">
              <button
                onClick={() => {
                  if (redirect_uri && delegationChain) {
                    // Use the created delegation chain directly (not the state)
                    const delegationString = JSON.stringify(
                      delegationChain.toJSON()
                    );
                    const encodedDelegation =
                      encodeURIComponent(delegationString);

                    window.location.href = `${redirect_uri}?del=${encodedDelegation}`;
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                Back to App
              </button>

              <p className="text-xs text-gray-500 text-center">
                If automatic redirect doesn't work, click the button above
              </p>
            </div>

            {/* Debug Info (only show if there's an issue) */}
            {redirect_uri && (
              <div className="w-full">
                <details className="text-xs text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-600">
                    Debug Info
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                    <p>Redirect URI: {redirect_uri.substring(0, 50)}...</p>
                    <p>Session Key: {sessionkey ? "Present" : "Missing"}</p>
                    <p>Login Type: {login_type || "Unknown"}</p>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MiddlePage;
