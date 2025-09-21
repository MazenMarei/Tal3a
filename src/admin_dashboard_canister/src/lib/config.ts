export interface AuthConfig {
  internetIdentityUrl: string;
  nfidUrl: string;
  isLocal: boolean;
}

export interface CanisterConfig {
  ownersCanisterId: string;
  userCanisterId: string;
  eventCanisterId: string;
  socialCanisterId: string;
  icrc1LedgerCanisterId: string;
}

// Environment detection
const isLocal =
  import.meta.env.DEV ||
  (typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname.includes("localhost")));

// Authentication URLs based on environment
export const authConfig: AuthConfig = {
  internetIdentityUrl: isLocal
    ? "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/"
    : "https://identity.ic0.app/",
  nfidUrl: isLocal
    ? "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/"
    : "https://nfid.one/",
  isLocal,
};

// Canister IDs based on environment
export const canisterConfig: CanisterConfig = {
  ownersCanisterId: isLocal
    ? import.meta.env.VITE_OWNERS_CANISTER_ID || "rrkah-fqaaa-aaaaa-aaaaq-cai"
    : "bhg4e-ziaaa-aaaai-atlfq-cai",
  userCanisterId: isLocal
    ? import.meta.env.VITE_USER_CANISTER_ID || "rno2w-sqaaa-aaaaa-aaacq-cai"
    : "bsbnj-yaaaa-aaaai-atlga-cai",
  eventCanisterId: isLocal
    ? import.meta.env.VITE_EVENT_CANISTER_ID || "rdmx6-jaaaa-aaaaa-aaadq-cai"
    : "bval5-vyaaa-aaaai-atlgq-cai",
  socialCanisterId: isLocal
    ? import.meta.env.VITE_SOCIAL_CANISTER_ID || "renrk-eyaaa-aaaaa-aaada-cai"
    : "b4dab-dqaaa-aaaai-atlha-cai",
  icrc1LedgerCanisterId: isLocal
    ? import.meta.env.VITE_ICRC1_LEDGER_CANISTER_ID ||
      "ryjl3-tyaaa-aaaaa-aaaba-cai"
    : "mxzaz-hqaaa-aaaar-qaada-cai",
};

// API host based on environment
export const API_HOST = isLocal ? "http://localhost:4943" : "https://ic0.app";

// Theme configuration
export const themeConfig = {
  colors: {
    primary: "#00B894",
    secondary: "#004E64",
    accent: "#FDC500",
    light: "#F8F9FA",
    dark: "#2E2E2E",
    success: "#00C853",
    warning: "#06FF6D",
    danger: "#D62828",
  },
} as const;
