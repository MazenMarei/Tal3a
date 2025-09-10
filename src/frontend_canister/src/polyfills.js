// Polyfill for crypto in browser environments
import { Buffer } from "buffer";

// Make Buffer global
globalThis.Buffer = Buffer;
globalThis.global = globalThis;

// Polyfill process if not available
if (typeof globalThis.process === "undefined") {
  globalThis.process = {
    env: {},
    nextTick: (fn, ...args) => setTimeout(() => fn(...args), 0),
    browser: true,
    version: "",
    versions: {},
    platform: "browser",
  };
}

// Enhanced crypto setup for insecure contexts (HTTP over LAN)
console.log("Initial crypto check:", {
  crypto: typeof globalThis.crypto,
  subtle: typeof globalThis.crypto?.subtle,
  location: window.location.href,
  isSecure: window.isSecureContext,
  isLocalhost:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1",
});

// Check if we need crypto polyfill
const needsCryptoPolyfill = !globalThis.crypto?.subtle;

if (needsCryptoPolyfill) {
  console.log(
    "Crypto.subtle not available - setting up polyfill for insecure context"
  );

  // Import and setup crypto polyfill
  import("isomorphic-webcrypto")
    .then((isoCrypto) => {
      console.log("Crypto polyfill loaded successfully");

      // If no crypto object at all, create it
      if (!globalThis.crypto) {
        globalThis.crypto = isoCrypto.default;
        console.log("Created global crypto object with polyfill");
      }
      // If crypto exists but no subtle, add it
      else if (!globalThis.crypto.subtle) {
        try {
          // Try to add subtle property
          if (Object.defineProperty) {
            Object.defineProperty(globalThis.crypto, "subtle", {
              value: isoCrypto.default.subtle,
              writable: false,
              configurable: true,
              enumerable: true,
            });
          } else {
            // Fallback for older browsers
            globalThis.crypto.subtle = isoCrypto.default.subtle;
          }
          console.log("Added crypto.subtle polyfill to existing crypto object");
        } catch (e) {
          console.warn(
            "Could not modify existing crypto object, replacing entirely:",
            e
          );
          globalThis.crypto = isoCrypto.default;
        }
      }

      // Verify the setup
      console.log("Crypto polyfill setup complete:", {
        crypto: typeof globalThis.crypto,
        subtle: typeof globalThis.crypto?.subtle,
        hasGenerateKey: typeof globalThis.crypto?.subtle?.generateKey,
      });

      // Dispatch a custom event to notify components that crypto is ready
      window.dispatchEvent(new CustomEvent("cryptoReady"));
    })
    .catch((err) => {
      console.error("Failed to load crypto polyfill:", err);
    });
} else {
  console.log("Native crypto.subtle is available");
  // Still dispatch the event for consistency
  setTimeout(() => window.dispatchEvent(new CustomEvent("cryptoReady")), 0);
}

export {};
